import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Database, ref, set, onValue } from '@angular/fire/database';
import Swal from 'sweetalert2';
import { RegisterationService } from '../../services/registeration-service';
import { HallCharacteristics } from '../../models/hall-characteristics';
import { RouterLink } from "@angular/router";
interface Reservation {
  start: string;
  end: string;
}
@Component({
  selector: 'app-time-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: '../time-registeration/time-registeration.html',
  styleUrls: ['../time-registeration/time-registeration.css'],
})
export class TimeRegistrationComponent implements OnInit {

  // ── Data ─────────────────────────────────────────────
  buildings: HallCharacteristics[];
  sortedHalls: any[] = [];
  sortAsc = true;
  isReserved = false;

  // ── Modal state ───────────────────────────────────────
  showModal = true;
  selectedDate = '';
  startTime = '';
  endTime = '';
  today = '';

  // ── Active hall being reserved ────────────────────────
  activeHall: any = null;

  readonly OPEN_HOUR  = 8;
  readonly CLOSE_HOUR = 15;

  constructor(
    private db: Database,
    private cdr: ChangeDetectorRef,
    private registerationService: RegisterationService,
  ) {
    this.buildings = this.registerationService.buildings;
  }

  // ── Lifecycle ─────────────────────────────────────────
  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
    this.sortedHalls = [...this.buildings[0].halls];


    const dbRef   = ref(this.db, 'board1/outputs/digital');
    const timeRef = ref(this.db, 'board1/outputs/digital/date');

    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();

      // Reset all halls to available
      this.buildings.forEach(b =>
        b.halls.forEach(h => (h.status = 'available'))
      );

      if (data !== null) this.isReserved = true;

      // Mark reserved hall
      if (data?.reserved === true) {
        this.buildings.forEach(b =>
          b.halls.forEach(h => {
            if (h.hallname === data.name || h.hallname === 'Digital') {
              h.status = 'reserved';
            }
          })
        );
      }

      // Sync booked dates from Firebase
      // onValue(timeRef, (timeSnap) => {
      //   const timeData: Reservation[] = timeSnap.val() || [];
      //   this.buildings.forEach(b =>
      //     b.halls.forEach(h => {
      //       if (h.hallname === data?.name) {
      //         h.bookedDates = timeData;
      //       }
      //     })
      //   );
      // });

      this.cdr.detectChanges();
    });
  }

  // ── Sorting ───────────────────────────────────────────
  toggleSort(): void {
    this.sortAsc = !this.sortAsc;
    const order = ['available', 'date', 'booked'];
    this.sortedHalls = [...this.sortedHalls].sort((a, b) => {
      const ai = order.indexOf(a.status);
      const bi = order.indexOf(b.status);
      return this.sortAsc ? ai - bi : bi - ai;
    });
  }

  // ── Modal controls ────────────────────────────────────
  openModal(hall: any): void {
    this.activeHall = hall;
    this.showModal  = true;
  }

  closeModal(): void {
    this.showModal  = false;
    this.activeHall = null;
    this.resetFields();
  }

  resetFields(): void {
    this.selectedDate = '';
    this.startTime    = '';
    this.endTime      = '';
  }

  // ── Validation ────────────────────────────────────────
  get isFormValid(): boolean {
    if (!this.selectedDate || !this.startTime || !this.endTime) return false;

    const [sh, sm] = this.startTime.split(':').map(Number);
    const [eh, em] = this.endTime.split(':').map(Number);
    const startMins = sh * 60 + sm;
    const endMins   = eh * 60 + em;

    return (
      sh >= this.OPEN_HOUR &&
      sh  < this.CLOSE_HOUR &&
      (eh < this.CLOSE_HOUR || (eh === this.CLOSE_HOUR && em === 0)) &&
      endMins > startMins
    );
  }

  get validationMessage(): string {
    if (!this.selectedDate || !this.startTime || !this.endTime) return '';

    const [sh]      = this.startTime.split(':').map(Number);
    const [eh, em]  = this.endTime.split(':').map(Number);
    const [, sm]    = this.startTime.split(':').map(Number);
    const startMins = sh * 60 + sm;
    const endMins   = eh * 60 + em;

    if (sh < this.OPEN_HOUR || sh >= this.CLOSE_HOUR)
      return 'Start time must be between 08:00 AM and 03:00 PM.';
    if (eh > this.CLOSE_HOUR || (eh === this.CLOSE_HOUR && em > 0))
      return 'End time cannot be after 03:00 PM.';
    if (endMins <= startMins)
      return 'End time must be after start time.';

    return '';
  }

  get duration(): string {
    if (!this.startTime || !this.endTime) return '';
    const [sh, sm] = this.startTime.split(':').map(Number);
    const [eh, em] = this.endTime.split(':').map(Number);
    const total = (eh * 60 + em) - (sh * 60 + sm);
    if (total <= 0) return '';
    const h = Math.floor(total / 60);
    const m = total % 60;
    if (h && m) return `${h}h ${m}min`;
    if (h)      return `${h}h`;
    return `${m}min`;
  }

  get isFullyBooked(): boolean {
    if (!this.activeHall) return false;
    const totalMs  = (this.CLOSE_HOUR - this.OPEN_HOUR) * 3_600_000;
    const todayStr = new Date().toISOString().split('T')[0];
    const dayStart = new Date(`${todayStr}T08:00:00`).getTime();
    const dayEnd   = new Date(`${todayStr}T15:00:00`).getTime();

    const sorted = (this.activeHall.bookedDates ?? [])
      .map(({ start, end }: Reservation) => ({
        s: new Date(start).getTime(),
        e: new Date(end).getTime(),
      }))
      .sort((a: any, b: any) => a.s - b.s);

    const merged: { s: number; e: number }[] = [];
    for (const iv of sorted) {
      const last = merged[merged.length - 1];
      if (last && iv.s <= last.e) last.e = Math.max(last.e, iv.e);
      else merged.push({ ...iv });
    }

    const bookedMs = merged.reduce(
      (t, { s, e }) => t + Math.max(0, Math.min(e, dayEnd) - Math.max(s, dayStart)),
      0
    );

    return bookedMs >= totalMs;
  }

  // ── Formatters ────────────────────────────────────────
  formatTime12(time: string): string {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const ampm   = h >= 12 ? 'PM' : 'AM';
    const h12    = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // ── Save to Firebase ──────────────────────────────────
  async confirmReservation(): Promise<void> {
    if (!this.isFormValid || !this.activeHall) return;

    const startISO = `${this.selectedDate}T${this.startTime}:00`;
    const endISO   = `${this.selectedDate}T${this.endTime}:00`;
    const newStart = new Date(startISO).getTime();
    const newEnd   = new Date(endISO).getTime();

    // Overlap check
    const isOverlapping = (this.activeHall.bookedDates ?? []).some(
      ({ start, end }: Reservation) =>
        newStart < new Date(end).getTime() && newEnd > new Date(start).getTime()
    );

    if (isOverlapping) {
      await Swal.fire({
        icon: 'warning',
        title: 'Slot Unavailable',
        text: 'This time slot overlaps with an existing reservation. Please choose a different time.',
        confirmButtonText: 'Got it',
      });
      return;
    }

    const updatedDates: Reservation[] = [
      ...(this.activeHall.bookedDates ?? []),
      { start: startISO, end: endISO },
    ];

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const dbRef = ref(this.db, 'board1/outputs/digital');

    try {
      await set(dbRef, {
        date: updatedDates,
        reserved: true,
        'reservation-code': randomCode,
        name: this.activeHall.hallname ?? 'Hall Reservation',
      });

      // Sync local state
      this.activeHall.bookedDates = updatedDates;

      await Swal.fire({
        icon: 'success',
        title: 'Reservation Confirmed!',
        html: `
          <p style="color:#666;margin-bottom:8px;">${this.formatDate(this.selectedDate)}</p>
          <p style="font-weight:600;font-size:18px;">
            ${this.formatTime12(this.startTime)} &rarr; ${this.formatTime12(this.endTime)}
          </p>
          <p style="color:#888;margin-top:6px;">Duration: ${this.duration}</p>
          <p style="margin-top:10px;font-size:14px;">
            Reservation code: <strong>${randomCode}</strong>
          </p>
        `,
        timer: 4000,
        showConfirmButton: false,
      });

      this.closeModal();

    } catch (error) {
      console.error('Firebase error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while saving. Please try again.',
      });
    }
  }
}

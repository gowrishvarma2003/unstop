import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  seats: { booked: boolean }[][] = [];
  rows = 12;
  seatsPerRow = 7;
  lastRowSeats = 3;
  maxSeatsPerBooking = 7;
  availableSeats = 80;
  bookingResult: { row: number, seat: number }[] = [];

  constructor() {
    this.initializeSeats();
  }

  // Initialize the seat layout: 11 rows with 7 seats each, and the last row with 3 seats
  initializeSeats() {
    for (let i = 0; i < this.rows; i++) {
      const seatsInRow = i < 11 ? this.seatsPerRow : this.lastRowSeats;
      this.seats[i] = Array(seatsInRow).fill({}).map(() => ({ booked: false }));
    }
  }

  // Book seats in the same row if possible
  bookInSingleRow(numSeats: number): boolean {
    for (let i = 0; i < this.rows; i++) {
      let availableCount = 0;
      let startSeatIndex = -1;

      for (let j = 0; j < this.seats[i].length; j++) {
        if (!this.seats[i][j].booked) {
          if (availableCount === 0) startSeatIndex = j;
          availableCount++;
        } else {
          availableCount = 0;
        }

        if (availableCount === numSeats) {
          // Mark seats as booked
          for (let k = startSeatIndex; k < startSeatIndex + numSeats; k++) {
            this.seats[i][k].booked = true;
            this.bookingResult.push({ row: i + 1, seat: k + 1 });
          }
          this.availableSeats -= numSeats;
          return true;
        }
      }
    }
    return false;
  }

  // Book nearest available seats (even if across rows)
  bookNearestSeats(numSeats: number) {
    this.bookingResult = [];

    for (let i = 0; i < this.rows && numSeats > 0; i++) {
      for (let j = 0; j < this.seats[i].length && numSeats > 0; j++) {
        if (!this.seats[i][j].booked) {
          this.seats[i][j].booked = true;
          this.bookingResult.push({ row: i + 1, seat: j + 1 });
          numSeats--;
        }
      }
    }
    this.availableSeats -= this.bookingResult.length;
  }

  // Handle seat booking
  bookSeats(numSeats: number) {
    if (numSeats > this.maxSeatsPerBooking) {
      alert(`You cannot book more than ${this.maxSeatsPerBooking} seats at a time.`);
      return;
    }

    if (numSeats > this.availableSeats) {
      alert('Not enough seats available.');
      return;
    }

    this.bookingResult = [];

    if (!this.bookInSingleRow(numSeats)) {
      this.bookNearestSeats(numSeats);
    }

    if (this.bookingResult.length > 0) {
      console.log('Booked Seats: ', this.bookingResult);
    } else {
      alert('No seats available.');
    }
  }
}

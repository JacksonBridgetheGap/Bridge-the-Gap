export class TimeSlot {
  start: Date;
  end: Date;

  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }

  toString(): string {
    return `${this.start.toLocaleString()} - ${this.end.toLocaleString()}`;
  }

  eventsOverlap(other: TimeSlot): boolean {
    return this.start < other.end && this.end > other.start;
  }
}

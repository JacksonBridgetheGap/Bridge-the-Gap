export class TimeSlot {
  start: Date;
  end: Date;

  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }

  eventOverlaps(event: TimeSlot): boolean {
    return event.start < this.end && event.end > this.start;
  }
}

export class TimeSlot {
  start: Date;
  end: Date;
  groupID: number | null;

  constructor(start: Date, end: Date, groupID: number | null) {
    this.start = start;
    this.end = end;
    this.groupID = groupID;
  }

  toString(): string {
    if (this.groupID !== null) {
      return `${this.start.toLocaleString()} - ${this.end.toLocaleString()} - ${this.groupID}`;
    }
    return `${this.start.toLocaleString()} - ${this.end.toLocaleString()}`;
  }

  duration(): number {
    return this.end.getTime() - this.start.getTime();
  }

  eventsOverlap(other: TimeSlot): boolean {
    return this.start < other.end && this.end > other.start;
  }
}

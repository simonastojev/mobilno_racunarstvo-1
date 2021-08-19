/* eslint-disable @typescript-eslint/quotes */
import { Performance } from "./performance.model";

export class UserReservation {

  constructor(
    public id: string,
    public userId: string,
    public performance: Performance,
    public numberOfTickets: number) {}

}

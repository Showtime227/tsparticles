import type { IMoveAngle } from "../../../Interfaces/Particles/Move/IMoveAngle";
import type { IOptionLoader } from "../../../Interfaces/IOptionLoader";
import type { RecursivePartial } from "../../../../Types";

/**
 * @category Options
 */
export class MoveAngle implements IMoveAngle, IOptionLoader<IMoveAngle> {
    public offset;
    public value;

    constructor() {
        this.offset = 0;
        this.value = 45;
    }

    public load(data?: RecursivePartial<IMoveAngle>): void {
        if (data === undefined) {
            return;
        }

        if (data.offset !== undefined) {
            this.offset = data.offset;
        }

        if (data.value !== undefined) {
            this.value = data.value;
        }
    }
}
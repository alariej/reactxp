import { Types } from '../../common/Interfaces';
export declare class EventHelpers {
    toKeyboardEvent(e: Types.SyntheticEvent): Types.KeyboardEvent;
    toFocusEvent(e: Types.SyntheticEvent): Types.FocusEvent;
    toMouseEvent(e: Types.SyntheticEvent): Types.MouseEvent;
    toDragEvent(e: Types.SyntheticEvent): Types.DragEvent;
    isRightMouseButton(e: Types.SyntheticEvent): boolean;
    keyboardToMouseEvent(e: Types.KeyboardEvent, layoutInfo: Types.LayoutInfo, contextMenuOffset: {
        x: number;
        y: number;
    }): Types.MouseEvent;
}
declare const _default: EventHelpers;
export default _default;

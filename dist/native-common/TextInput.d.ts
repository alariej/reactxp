import * as React from 'react';
import * as RN from 'react-native';
import { FocusArbitratorProvider } from '../common/utils/AutoFocusHelper';
import { Types } from '../common/Interfaces';
export interface TextInputState {
    inputValue: string;
    isFocused: boolean;
}
export interface TextInputContext {
    focusArbitrator?: FocusArbitratorProvider;
}
export declare class TextInput extends React.Component<Types.TextInputProps, TextInputState> {
    static contextTypes: React.ValidationMap<any>;
    context: TextInputContext;
    private _selectionToSet;
    private _selection;
    protected _mountedComponent: RN.TextInput | undefined;
    constructor(props: Types.TextInputProps, context?: TextInputContext);
    UNSAFE_componentWillReceiveProps(nextProps: Types.TextInputProps): void;
    componentDidMount(): void;
    protected _render(props: RN.TextInputProps, onMount: (textInput: RN.TextInput | null) => void): JSX.Element;
    render(): JSX.Element;
    protected _onMount: (component: RN.TextInput | null) => void;
    private _onFocus;
    private _onBlur;
    private _onChangeText;
    private _onSelectionChange;
    private _onKeyPress;
    private _onPaste;
    private _onScroll;
    blur(): void;
    requestFocus(): void;
    focus(): void;
    setAccessibilityFocus(): void;
    isFocused(): boolean;
    selectAll(): void;
    selectRange(start: number, end: number): void;
    getSelectionRange(): {
        start: number;
        end: number;
    };
    setValue(value: string): void;
}
export default TextInput;

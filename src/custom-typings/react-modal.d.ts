/// <reference types="react"/>

declare module "react-modal" {
    interface ReactModal {
        isOpen: boolean;
        style?: {
            content?: {
                [key: string]: any;
            },
            overlay?: {
                [key: string]: any;
            }
        },
        appElement?: HTMLElement | {},
        onAfterOpen?: Function,
        onRequestClose?: Function,
        closeTimeoutMS?: number,
        ariaHideApp?: boolean,
        shouldCloseOnOverlayClick?: boolean,
        portalClassName?: string
        className?: string
        overlayClassName?: string,
        contentLabel?: string
    }
    let ReactModal: React.ClassicComponentClass<ReactModal>;
    export = ReactModal;
}

import { EventEmitter } from '@angular/core';
declare var UIkit: any;

export class UikitModal<T = any, O = any, E = any> {
    data: T;
     hide: EventEmitter<void> = new EventEmitter<void>();
    success: EventEmitter<O> = new EventEmitter<O>();
    error: EventEmitter<E> = new EventEmitter<E>();
  
    protected _elementId: any;
  
    eventHandles: UIkitModalEvent = {
      beforeshow: () => {},
      show: () => {},
      shown: () => {},
      beforehide: () => {},
      hide: () => {},
      hidden: () => {}
    };
  
    static show(id: string) {
      UIkit.update(document.body, "update");
      if(UIkit.modal(id)) {
        UIkit.modal(id).show();
      }
    }
  
    OnInit() {
      UIkit.update(document.body, "update");
      if (this.modal) {
        this.modal.$update("update");
      }
      this.uikit.util.on(
        this.elementId,
        "beforeshow",
        this.eventHandles.beforeshow
      );
      this.uikit.util.on(this.elementId, "show", this.eventHandles.show);
      this.uikit.util.on(this.elementId, "shown", this.eventHandles.shown);
      this.uikit.util.on(
        this.elementId,
        "beforehide",
        this.eventHandles.beforehide
      );
      this.uikit.util.on(this.elementId, "hide", this.eventHandles.hide);
      this.uikit.util.on(this.elementId, "hidden", this.eventHandles.hidden);
    }
  
    OnDestroy() {
      if(this.modal) {
        this.modal.$destroy(true);
      }
      UIkit.update(document.body, "update");
    }
  
    get elementId() {
      return this._elementId;
    }
  
    get modal() {
      return this.uikit.modal(`#${this.elementId}`);
    }
  
    get modalElement() {
      return this.modal.$el as HTMLDivElement;
    }
  
    get uikit() {
      return UIkit;
    }
  
    close() {
      this.modal.hide();
      this.hide.emit();
    }
  
    submit(payload: O) {
      this.modal.hide();
      this.success.emit(payload);
    }
  
    failure(payload: E) {
      this.modal.hide();
      this.error.emit(payload);
    }
  }
  
  
  export interface UIkitModalEvent {
      /**
       * #### Fires before an item is shown.
       * @type {Function}
       * @memberof UIkitModalEvent
       */
      beforeshow: Function;
      /**
       * #### Fires after an item is shown.
       * @type {Function}
       * @memberof UIkitModalEvent
       */
      show: Function;
      /**
       * #### Fires after the item's show animation has completed.
       * @type {Function}
       * @memberof UIkitModalEvent
       */
      shown: Function;
      /**
       * #### Fires before an item is hidden.
       * @type {Function}
       * @memberof UIkitModalEvent
       */
      beforehide: Function;
      /**
       * #### Fires after an item's hide animation has started.
       * @type {Function}
       * @memberof UIkitModalEvent
       */
      hide: Function;
      /**
       * #### Fires after an item is hidden.
       * @type {Function}
       * @memberof UIkitModalEvent
       */
      hidden: Function;
    }
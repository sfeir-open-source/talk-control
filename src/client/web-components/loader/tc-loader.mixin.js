export const LoaderMixin = function(superclass) {
    if (superclass) {
        return class extends superclass {
            constructor() {
                super();
                this._callbackOnReady;
                this._callbackOnError;
            }

            onReady(cb) {
                this._callbackOnReady = cb;
            }

            onError(cb) {
                this._callbackOnError = cb;
            }

            _mixinDoReady() {
                if (this._callbackOnReady) {
                    this._callbackOnReady();
                }
            }

            _mixinDoError() {
                if (this._callbackOnError) {
                    this._callbackOnError();
                }
            }
        };
    } else {
        return class {
            constructor() {
                this._callbackOnReady;
                this._callbackOnError;
            }

            onReady(cb) {
                this._callbackOnReady = cb;
            }

            onError(cb) {
                this._callbackOnError = cb;
            }

            _mixinDoReady() {
                if (this._callbackOnReady) {
                    this._callbackOnReady();
                }
            }

            _mixinDoError() {
                if (this._callbackOnError) {
                    this._callbackOnError();
                }
            }
        };
    }
};

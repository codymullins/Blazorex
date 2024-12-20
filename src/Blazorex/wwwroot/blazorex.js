window.Blazorex = (() => {
    const _contexts = [],
        _refs = [],
        _images = [],
        _patterns = [];

    const initCanvas = (id, managedInstance) => {
            const canvas = document.getElementById(id);
            if (!canvas) {
                return;
            }
            
            _contexts[id] = {
                id: id,
                context: canvas.getContext("2d"),
                managedInstance
            };

            canvas.ontouchstart = (e) => {
                e.preventDefault();
                const context = _contexts[id];
                const rect = canvas.getBoundingClientRect();

                const canvasX = e.touches[0].clientX - rect.left;
                const canvasY = e.touches[0].clientY - rect.top;
                
                const coords = {
                    X: (canvasX),
                    Y: (canvasY)
                };

                context.managedInstance.invokeMethodAsync('TouchStarted', coords);
            }

            canvas.ontouchmove = (e) => {
                e.preventDefault();
                const context = _contexts[id];
                const rect = canvas.getBoundingClientRect();
                const coords = {
                    X: (e.touches[0].clientX - rect.left),
                    Y: (e.touches[0].clientY - rect.top)
                };
                context.managedInstance.invokeMethodAsync('TouchMoved', coords);
            }

            canvas.ontouchend = (e) => {
                e.preventDefault();
                const context = _contexts[id];
                context.managedInstance.invokeMethodAsync('TouchEnded');
            }

            // Add mouse event listeners for click/drag support
            canvas.onmousedown = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const context = _contexts[id];
                const coords = {
                    X: e.offsetX,
                    Y: e.offsetY,
                    Button: e.button
                };
                context.managedInstance.invokeMethodAsync('MouseDown', coords);
            }
            
            canvas.onmousemove = (e) => {
                const context = _contexts[id];
                const coords = {
                    X: e.offsetX,
                    Y: e.offsetY
                };
                context.managedInstance.invokeMethodAsync('MouseMoved', coords);
            }
            canvas.onmouseup = (e) => {
                e.preventDefault();
                const context = _contexts[id];
                context.managedInstance.invokeMethodAsync('MouseUp');
            }
        }, getRef = (ref) => {
            const pId = `_bl_${ref.Id}`,
                elem = _refs[pId] || document.querySelector(`[${pId}]`);
            _refs[pId] = elem;
            return elem;
        }, callMethod = (ctx, method, params) => {
            for (let p in params) {
                if (params[p] != null && params[p].IsRef) {
                    params[p] = getRef(params[p]);
                }
            }

            const result = ctx[method](...params);
            return result;
        },
        setProperty = (ctx, property, value) => {
            const propValue = (property == 'fillStyle' ? _patterns[value] || value : value);
            ctx[property] = propValue;
        }, createImageData = (ctxId, width, height) => {
            const ctx = _contexts[ctxId].context,
                imageData = ctx.createImageData(width, height);
            _images[_images.length] = imageData;
            return _images.length - 1;
        }, putImageData = (ctxId, imageId, data, x, y) => {
            const ctx = _contexts[ctxId].context,
                imageData = _images[imageId];
            imageData.data.set(data);
            ctx.putImageData(imageData, x, y);
        },
        onFrameUpdate = (timeStamp) => {
            for (let ctx in _contexts) {
                _contexts[ctx].managedInstance.invokeMethodAsync('UpdateFrame', timeStamp);
            }
            window.requestAnimationFrame(onFrameUpdate);
        },
        processBatch = (ctxId, jsonBatch) => {
            const ctx = _contexts[ctxId].context;
            if (!ctx) {
                return;
            }
            const batch = JSON.parse(jsonBatch);

            for (const op of batch) {
                if (op.IsProperty)
                    setProperty(ctx, op.MethodName, op.Args);
                else
                    callMethod(ctx, op.MethodName, op.Args);
            }
        },
        directCall = (ctxId, methodName, jParams) => {
            const ctx = _contexts[ctxId].context;
            if (!ctx) {
                return;
            }
            const params = JSON.parse(jParams),
                result = callMethod(ctx, methodName, params);

            if (methodName == 'createPattern') {
                const patternId = _patterns.length;
                _patterns.push(result);
                return patternId;
            }

            return result;
        },
        removeContext = (ctxId) => {
            const ctx = _contexts[ctxId].context;
            if (!ctx) {
                return;
            }

            delete _contexts[ctxId];
        },
        saveCanvas = (ctxId) => {
            const ctx = _contexts[ctxId];
            const canvas = document.getElementById(ctx.id);
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);

                // open in new tab
                window.open(url, '_blank');
                URL.revokeObjectURL(url);
            });
        }
    ;

    window.onkeyup = (e) => {
        for (let ctx in _contexts) {
            _contexts[ctx].managedInstance.invokeMethodAsync('KeyReleased', e.keyCode);
        }
    };
    window.onkeydown = (e) => {
        for (let ctx in _contexts) {
            _contexts[ctx].managedInstance.invokeMethodAsync('KeyPressed', e.keyCode);
        }
    };
    // window.onmousemove = (e) => {
    //     const coords = {
    //         X: e.offsetX,
    //         Y: e.offsetY
    //     };
    //     for (let ctx in _contexts) {
    //         _contexts[ctx].managedInstance.invokeMethodAsync('MouseMoved', coords);
    //     }
    // };
    //
    window.onresize = function () {
        for (let ctx in _contexts) {
            _contexts[ctx].managedInstance.invokeMethodAsync('Resized', window.innerWidth, window.innerHeight);
        }
    };

    return {
        initCanvas,
        onFrameUpdate,
        createImageData,
        putImageData,
        processBatch,
        directCall,
        removeContext,
        saveCanvas
    };
})();

window.requestAnimationFrame(Blazorex.onFrameUpdate);




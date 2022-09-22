window.Blazorex = (() => {
    const _contexts = [],
        _refs = [],
        _imageDatas = [];

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
    }, getRef = (ref) => {
        const pId = `_bl_${ref.Id}`,
            elem = _refs[pId] || document.querySelector(`[${pId}]`);
        _refs[pId] = elem;
        return elem;
    }, callCanvasMethod = (rawCtxId, rawMethod, rawParams) => {
        const ctxId = BINDING.conv_string(rawCtxId),
            ctx = _contexts[ctxId].context;
        if (!ctx) {
            return;
        }
        const method = BINDING.conv_string(rawMethod),
            jsonParams = BINDING.conv_string(rawParams),
            params = JSON.parse(jsonParams);

        for (let p in params) {
            if (params[p] != null && params[p].IsRef) {
                params[p] = getRef(params[p]);
            }
        }

        ctx[method](...params);
    }, setCanvasProperty = (rawCtxId, rawProp, rawValue) => {
        const ctxId = BINDING.conv_string(rawCtxId),
            ctx = _contexts[ctxId].context;
        if (!ctx) {
            return;
        }
        const property = BINDING.conv_string(rawProp),
            jsonValue = BINDING.conv_string(rawValue);

        ctx[property] = jsonValue;
    }, createImageData = (ctxId, width, height) => {
        const ctx = _contexts[ctxId].context,
            imageData = ctx.createImageData(width, height);
        _imageDatas[_imageDatas.length] = imageData;
        return _imageDatas.length - 1;
    }, putImageData = (ctxId, imageId, data, x, y) => {
        const ctx = _contexts[ctxId].context,
            imageData = _imageDatas[imageId];
        for (let i = 0; i != data.length;i++)
            imageData.data[i] = data[i];
        ctx.putImageData(imageData, x, y);
    }, onFrameUpdate = (timeStamp) => {
        for (let ctx in _contexts) {
            _contexts[ctx].managedInstance.invokeMethodAsync('__BlazorexGameLoop', timeStamp);
        }
        window.requestAnimationFrame(onFrameUpdate);
    };

    return {
        initCanvas,
        callCanvasMethod,
        setCanvasProperty,
        createImageData,
        putImageData,
        onFrameUpdate
    };
})();

window.requestAnimationFrame(Blazorex.onFrameUpdate);
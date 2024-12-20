using Microsoft.AspNetCore.Components;
using System;
using System.Threading.Tasks;

namespace Blazorex;

public readonly struct CanvasCreationOptions()
{
    public ElementReference ElementReference { get; init; } = default;

    /// <summary>
    /// the width of the canvas
    /// </summary>
    public required int Width { get; init; } = 0;

    /// <summary>
    /// the height of the canvas
    /// </summary>
    public required int Height { get; init; } = 0;

    /// <summary>
    /// the device pixel ratio of the canvas. Defaults to 1.
    /// </summary>
    public float DevicePixelRatio { get; init; } = 1;

    /// <summary>
    /// when true, the canvas will not be rendered, but will keep triggering events
    /// </summary>
    public bool Hidden { get; init; } = false;

    /// <summary>
    /// fired when the canvas is ready to process events
    /// </summary>
    public Action<CanvasBase> OnCanvasReady { get; init; } = null;

    /// <summary>
    /// async version of <see cref="OnCanvasReady"/>.
    /// </summary>
    /// <remarks>
    /// <see cref="OnCanvasReady"/> will ALWAYS take precedence over this, if both are set.
    /// </remarks>
    public Func<CanvasBase, ValueTask> OnCanvasReadyAsync { get; init; } = null;

    /// <summary>
    /// fired at every frame refresh
    /// </summary>
    public Action<float> OnFrameReady { get; init; } = null;

    public Action<int> OnKeyUp { get; init; } = null;
    public Action<int> OnKeyDown { get; init; } = null;


    public Action<MouseCoords> OnMouseMove { get; init; } = null;
    public Action<Size> OnResize { get; init; } = null;
    public Action<MouseCoords> OnTouchStarted { get; init; } = null;
    public Action<MouseCoords> OnTouchMoved { get; init; } = null;
    public Action OnMouseUp { get; init; } = null;
    public Action<MouseEvent> OnMouseDown { get; init; } = null;
    public Action OnTouchEnded { get; init; } = null;
}
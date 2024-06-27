﻿using Microsoft.AspNetCore.Components;
using System;

namespace Blazorex;

public readonly struct CanvasCreationOptions
{
    public ElementReference ElementReference { get; init; }
    
    /// <summary>
    /// the width of the canvas
    /// </summary>
    public required int Width { get; init; }

    /// <summary>
    /// the height of the canvas
    /// </summary>
    public required int Height { get; init; }

    /// <summary>
    /// when true, the canvas will not be rendered, but will keep triggering events
    /// </summary>
    public bool Hidden { get; init; }

    /// <summary>
    /// fired when the canvas is ready to process events
    /// </summary>
    public Action<CanvasBase> OnCanvasReady { get; init; }

    /// <summary>
    /// fired at every frame refresh
    /// </summary>
    public Action<float> OnFrameReady { get; init; }

    public Action<int> OnKeyUp { get; init; }
    public Action<int> OnKeyDown { get; init; }


    public Action<MouseCoords> OnMouseMove { get; init; }
    public Action<Size> OnResize { get; init; }
}
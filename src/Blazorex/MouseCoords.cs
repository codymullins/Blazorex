namespace Blazorex
{
    public struct MouseCoords
    {
        public float X { get; set; }
        public float Y { get; set; }
    }
    
    public struct MouseEvent
    {
        public MouseCoords MouseCoords { get; set; }
        public int Button { get; set; }
        public float X { get; set; }
        public float Y { get; set; }
    }
}
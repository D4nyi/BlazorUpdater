namespace BlazorUpdater;

/// <summary>
/// Update bar position
/// </summary>
public enum Align
{
    /// <summary>
    /// Same as <see cref="Align.Top"/>
    /// </summary>
    Default = 0,
    
    /// <summary>
    /// Update bar will be positioned to the top of the screen
    /// </summary>
    Top,
    
    /// <summary>
    /// Update bar will be positioned to the bottom of the screen
    /// </summary>
    Bottom
}

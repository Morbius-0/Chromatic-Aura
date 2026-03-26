import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Generate a random ID for this specific session/browser
const sessionId = Math.random().toString(36).substring(2, 15);

export function Controller() {
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    // Connect to the presence room
    const room = supabase.channel('aura_room', {
      config: {
        presence: {
          key: sessionId,
        },
      },
    });

    room.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const color = activeColor || 'disconnected';
        await room.track({ color });
      }
    });

    setChannel(room);

    return () => {
      room.unsubscribe();
      supabase.removeChannel(room);
    };
  }, []);

  const handleColorPress = async (colorName: string) => {
    setActiveColor(colorName);
    
    // Vibrate device if supported
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }

    if (channel) {
      await channel.track({ color: colorName });
    }
  };

  return (
    <div className="controller-container">
      <div className="title">L'AURA</div>
      <div className="color-grid">
        <button 
          className={`color-button btn-red ${activeColor === 'red' ? 'active' : ''}`}
          onClick={() => handleColorPress('red')}
          onTouchStart={() => handleColorPress('red')}
        ></button>
        <button 
          className={`color-button btn-blue ${activeColor === 'blue' ? 'active' : ''}`}
          onClick={() => handleColorPress('blue')}
          onTouchStart={() => handleColorPress('blue')}
        ></button>
        <button 
          className={`color-button btn-amber ${activeColor === 'amber' ? 'active' : ''}`}
          onClick={() => handleColorPress('amber')}
          onTouchStart={() => handleColorPress('amber')}
        ></button>
        <button 
          className={`color-button btn-purple ${activeColor === 'purple' ? 'active' : ''}`}
          onClick={() => handleColorPress('purple')}
          onTouchStart={() => handleColorPress('purple')}
        ></button>
      </div>
    </div>
  );
}

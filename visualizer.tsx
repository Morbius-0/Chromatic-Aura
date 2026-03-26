import { useState, useEffect } from 'react';
import { supabase, COLORS } from '../lib/supabase';

export function Visualizer() {
  // We keep track of the dominant color states.
  // We use opacity percentages based on how many people selected each color.
  const [colorWeights, setColorWeights] = useState({
    red: 0,
    blue: 0,
    amber: 0,
    purple: 0
  });

  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const room = supabase.channel('aura_room');

    room
      .on('presence', { event: 'sync' }, () => {
        const state = room.presenceState();
        
        let redCount = 0;
        let blueCount = 0;
        let amberCount = 0;
        let purpleCount = 0;
        let total = 0;

        // Iterate through all connected users (Presence)
        for (const [key, presences] of Object.entries(state)) {
            // A user can theoretically have multiple tabs open, so take the first state
            const presence = (presences as any)[0];
            if (presence && presence.color) {
                if (presence.color === 'red') redCount++;
                if (presence.color === 'blue') blueCount++;
                if (presence.color === 'amber') amberCount++;
                if (presence.color === 'purple') purpleCount++;
                total++;
            }
        }

        setTotalUsers(total);

        // Normalize weights between 0 and 1. If nobody is connected, stay dark.
        if (total > 0) {
            setColorWeights({
                red: redCount / total,
                blue: blueCount / total,
                amber: amberCount / total,
                purple: purpleCount / total
            });
        } else {
            setColorWeights({ red: 0, blue: 0, amber: 0, purple: 0 });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(room);
    };
  }, []);

  return (
    <div className="visualizer-container">
      {/* Background layer */}
      <div 
         className="aura-layer" 
         style={{ backgroundColor: COLORS.red, opacity: colorWeights.red }}
      />
      <div 
         className="aura-layer" 
         style={{ backgroundColor: COLORS.blue, opacity: colorWeights.blue }}
      />
      <div 
         className="aura-layer" 
         style={{ backgroundColor: COLORS.amber, opacity: colorWeights.amber }}
      />
      <div 
         className="aura-layer" 
         style={{ backgroundColor: COLORS.purple, opacity: colorWeights.purple }}
      />
      
      {/* Optional: subtle text in bottom right to show connection count */}
      <div style={{ position: 'absolute', bottom: 20, right: 20, opacity: 0.3, fontSize: '12px' }}>
        Spectateurs connectés: {totalUsers}
      </div>
    </div>
  );
}

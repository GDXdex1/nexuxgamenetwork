'use client';

import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { OBJECT_TYPES } from '@/config/suiConfig';
import { JABLIX_TEMPLATES } from '@/data/jablixDatabase';

export interface ScannedJablix {
  id: string;
  objectId: string;
  type: 'elemental' | 'special';
  type_id: number;
  name: string;
  phase: number;
  hp: number;
  energy: number;
  speed: number;
  attack: number;
  defense: number;
  element1: string;
  element2: string | null;
  imageUrl: string;
  cards: Array<{
    name: string;
    element: string;
    type: string;
    energy_cost: number;
    effect: string;
    damage: number;
  }>;
}

export function useJablixScanner() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [jablixList, setJablixList] = useState<ScannedJablix[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!account?.address) {
      setJablixList([]);
      return;
    }

    const fetchJablix = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('🔍 Scanning Jablixes for:', account.address);

        // 1. Fetch Elemental Jablixes
        const elementalObjects = await client.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: OBJECT_TYPES.JABLIX_ELEMENTAL,
          },
          options: { showContent: true, showOwner: true, showType: true },
        });

        console.log('📦 Elemental objects found:', elementalObjects.data.length);

        // 2. Fetch Special Jablixes
        const specialObjects = await client.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: OBJECT_TYPES.JABLIX_SPECIAL,
          },
          options: { showContent: true, showOwner: true, showType: true },
        });

        console.log('📦 Special objects found:', specialObjects.data.length);

        const allJablix = [...(elementalObjects.data || []), ...(specialObjects.data || [])];

        console.log('📦 Total Jablixes found:', allJablix.length);

        // 3. Parse the data
        const parsed = allJablix.map((obj): ScannedJablix | null => {
          const content = obj.data?.content;
          if (!content || content.dataType !== 'moveObject') {
            console.warn('⚠️ Invalid content for object:', obj.data?.objectId);
            return null;
          }

          const fields = content.fields as any;
          const isElemental = content.type.includes('JablixElemental');

          const type_id = parseInt(fields.type_id || '0');
          const name = fields.name || 'Unknown';
          const objectId = obj.data?.objectId || '';

          console.log(`✅ Parsed Jablix: ${name} (type_id: ${type_id}, objectId: ${objectId})`);

          // Get image from blockchain or fallback to local template
          let imageUrl = fields.image || '';
          if (!imageUrl || imageUrl.trim() === '' || !imageUrl.startsWith('http')) {
            const template = JABLIX_TEMPLATES.find((t) => t.id === type_id);
            if (template && template.imageUrl) {
              imageUrl = template.imageUrl;
              console.log(`🖼️ Using template image for ${name}`);
            } else {
              imageUrl = 'https://via.placeholder.com/300?text=Jablix';
              console.warn(`⚠️ No template found for type_id ${type_id}`);
            }
          }

          // Parse cards
          const cards = (fields.cards || []).map((card: any) => ({
            name: card.fields?.name || card.name || 'Unknown Card',
            element: card.fields?.element || card.element || 'Unknown',
            type: card.fields?.type_ || card.fields?.type || card.type || 'Unknown',
            energy_cost: parseInt(card.fields?.energy_cost || card.energy_cost || '0'),
            effect: card.fields?.effect || card.effect || 'No effect',
            damage: parseInt(card.fields?.damage || card.damage || '0'),
          }));

          return {
            id: `jablix_${type_id}`,
            objectId: objectId,
            type: isElemental ? 'elemental' : 'special',
            type_id: type_id,
            name: name,
            phase: parseInt(fields.phase || '1'),
            hp: parseInt(fields.hp || '0'),
            energy: parseInt(fields.energy || '0'),
            speed: parseInt(fields.speed || '0'),
            attack: parseInt(fields.attack || '0'),
            defense: parseInt(fields.defense || '0'),
            element1: fields.element1 || fields.elements?.[0] || 'Unknown',
            element2: fields.element2 || fields.elements?.[1] || null,
            imageUrl: imageUrl,
            cards: cards,
          };
        }).filter((j): j is ScannedJablix => j !== null);

        console.log('✅ Successfully parsed', parsed.length, 'Jablixes');

        setJablixList(parsed);
      } catch (err) {
        console.error('❌ Error fetching Jablixes:', err);
        setError('Error scanning your Jablixes from the blockchain');
      } finally {
        setLoading(false);
      }
    };

    fetchJablix();
  }, [account?.address, client]);

  return { jablixList, loading, error };
}

export function JablixScanner() {
  const account = useCurrentAccount();
  const { jablixList, loading, error } = useJablixScanner();

  if (!account) {
    return <p className="text-pink-200">Connect your Sui wallet to scan your Jablixes</p>;
  }

  if (loading) return <p className="text-pink-200">Scanning your Jablixes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-4">
        Your Jablixes ({jablixList.length})
      </h2>
      {jablixList.length === 0 ? (
        <p className="text-pink-200">No Jablixes found in this wallet</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {jablixList.map((jablix: ScannedJablix) => (
            <li key={jablix.objectId} style={{ margin: '20px 0', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <strong>{jablix.name}</strong> ({jablix.type}) - Phase {jablix.phase} - Type ID: {jablix.type_id}
              <div>
                <strong>Stats:</strong> HP {jablix.hp} | Energy {jablix.energy} | Speed {jablix.speed} | 
                Attack {jablix.attack} | Defense {jablix.defense}
              </div>
              <div><strong>Elements:</strong> {jablix.element1}{jablix.element2 ? `, ${jablix.element2}` : ''}</div>
              <h4>Cards ({jablix.cards.length}):</h4>
              <ul>
                {jablix.cards.map((card: any, idx: number) => (
                  <li key={idx}>
                    {card.name} ({card.element}) - {card.type} | Cost: {card.energy_cost} | Effect: {card.effect} | Dmg: {card.damage}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { ListGroup, Button, Spinner } from 'react-bootstrap';
import { getToken } from '../services/authService';

const AudioHistory: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAudioFiles = async () => {
      setLoading(true);
      setError('');
      const token = getToken();
      try {
        const response = await fetch('http://localhost:5000/api/tts/list', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setAudioFiles(data.audioFiles);
      } catch (err) {
        setError('Failed to fetch audio history');
      } finally {
        setLoading(false);
      }
    };
    fetchAudioFiles();
  }, []);

  const handleDelete = async (orderId: string) => {
    setLoading(true);
    setError('');
    const token = getToken();
    try {
      await fetch(`http://localhost:5000/api/tts/audio/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAudioFiles(audioFiles.filter((file) => file !== orderId));
    } catch (err) {
      setError('Failed to delete audio file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Audio History</h2>
      {loading && <Spinner animation="border" />}
      {error && <p>{error}</p>}
      <ListGroup>
        {audioFiles.map((file) => (
          <ListGroup.Item key={file}>
            <audio
              controls
              src={`http://localhost:5000/api/tts/audio/${file}`}
            />
            <Button variant="danger" onClick={() => handleDelete(file)}>
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default AudioHistory;

import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { getToken } from '../services/authService';

const TTSInput: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [audioSrc, setAudioSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');

  useEffect(() => {
    const fetchModels = async () => {
      const token = getToken();
      try {
        const response = await fetch('http://localhost:5000/api/tts/models', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setModels(data.models);
        setSelectedModel(data.models[0]); // Set the first model as default
      } catch (err) {
        setError('Failed to fetch TTS models');
      }
    };
    fetchModels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = getToken();
    const startTime = Date.now();

    try {
      const response = await fetch('http://localhost:5000/api/tts/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text, model: selectedModel })
      });
      const data = await response.json();
      const blobResponse = await fetch(
        `http://localhost:5000/api/tts/audio/${data.orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const blob = await blobResponse.blob();
      setAudioSrc(URL.createObjectURL(blob));
      const endTime = Date.now();
      console.log(`Request completed in ${endTime - startTime} ms`);
    } catch (err) {
      setError('Failed to generate audio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Synthesize Text to Speech</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="ttsText">
          <Form.Label>Text</Form.Label>
          <Form.Control
            as="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="ttsModel">
          <Form.Label>Select Model</Form.Label>
          <Form.Control
            as="select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Synthesize'}
        </Button>
      </Form>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <audio controls src={audioSrc}></audio>
    </div>
  );
};

export default TTSInput;

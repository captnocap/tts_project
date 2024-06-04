import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MediaPlayer from './components/MediaPlayer';
import Login from './components/Login';
import Register from './components/Register';
import AudioHistory from './components/AudioHistory';
import TTSInput from './components/TTSInput';
import { getToken } from './services/authService';

const App: React.FC = () => {
    const [audioSrc, setAudioSrc] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = getToken();
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        const fetchAudio = async () => {
            const token = getToken();
            if (token) {
                const response = await fetch(
                    'http://localhost:5000/api/tts/audio',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                const blob = await response.blob();
                setAudioSrc(URL.createObjectURL(blob));
            }
        };
        fetchAudio();
    }, []);

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Text-to-Speech Generator</h1>
                </header>
                <Container>
                    <main>
                        <Routes>
                            <Route
                                path="/login"
                                element={
                                    <Login
                                        onLogin={function (): void {
                                            throw new Error(
                                                'Function not implemented.'
                                            );
                                        }}
                                    />
                                }
                            />
                            <Route path="/register" element={<Register />} />
                            {isAuthenticated ? (
                                <>
                                    <Route
                                        path="/"
                                        element={
                                            <>
                                                <Row>
                                                    <Col>
                                                        <MediaPlayer
                                                            audioSrc={audioSrc}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={6}>
                                                        <TTSInput />
                                                    </Col>
                                                    <Col md={6}>
                                                        <AudioHistory />
                                                    </Col>
                                                </Row>
                                            </>
                                        }
                                    />
                                </>
                            ) : (
                                <Route
                                    path="/"
                                    element={
                                        <Login
                                            onLogin={function (): void {
                                                throw new Error(
                                                    'Function not implemented.'
                                                );
                                            }}
                                        />
                                    }
                                />
                            )}
                        </Routes>
                    </main>
                </Container>
            </div>
        </Router>
    );
};

export default App;

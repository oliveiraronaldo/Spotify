// src/AlbumPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function AlbumPage() {
    const CLIENT_ID = "078ddffa5fed473594cfbf543a66e462";
    const CLIENT_SECRET = "f47bf8c3cee646ac9e49f7d5cf6d0f22";

    const [tracks, setTracks] = useState([]);
    const { id, name } = useParams();
    const audioRef = useRef(new Audio());
    const [playing, setPlaying] = useState(null);
    const navigate = useNavigate();


    async function getToken() {
        const data = {
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        }
        let qsData = [];
        for (let i in data) {
            qsData.push(`${i}=${data[i]}`);
        }
        qsData = qsData.join('&');
        try {
            const resp = await fetch('https://accounts.spotify.com/api/token', {
                method: "POST",
                headers: { "Content-type": "application/x-www-form-urlencoded" },
                body: qsData
            });
            const token = await resp.json();
            return token.access_token;

        } catch (err) {
            console.error(err);
        }
    }


    async function getTracks() {
        let token = await getToken();
        let url = `https://api.spotify.com/v1/albums/${id}/tracks`

        const resp = await fetch(url, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        let data = await resp.json();


        setTracks(data.items);

    };

    function playPausePreview(track) {
        const audio = audioRef.current;

        if (playing === track.id) {
            audio.pause();
            setPlaying(null);
        } else {
            audio.src = track.preview_url;
            audio.play();
            setPlaying(track.id);
        }
    };

    useEffect(() => {

        getTracks();
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto p-8">
                <button
                    className=" mb-4 inline-block bg-gray-800 p-4 rounded-md"
                    onClick={() => navigate(-1)}
                >
                    Voltar para o artista
                </button>

                <h1 className="text-4xl font-extrabold mb-8">{name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tracks.map((track) => (
                        <div key={track.id} className="bg-gray-800 rounded-md overflow-hidden">
                            <div className="p-4">
                                <p className="text-xl font-bold mb-2">{track.track_number}. {track.name}</p>
                                <p className="text-gray-400">{(track.duration_ms / 1000 / 60).toFixed(2)} min</p>
                            </div>
                            <div className="flex justify-center p-4">
                                <button
                                    className={`bg-${playing === track.id ? 'red' : 'green'}-500 py-2 px-4 rounded-md focus:outline-none hover:bg-${playing === track.id ? 'red' : 'green'}-600`}
                                    onClick={() => playPausePreview(track)}
                                >
                                    {playing === track.id ? 'Pause' : 'Play'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

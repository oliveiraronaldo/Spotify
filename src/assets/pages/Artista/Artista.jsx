// src/ArtistPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';


export default function ArtistPage() {
    const CLIENT_ID = "****************";
    const CLIENT_SECRET = "***************";

    const [albums, setAlbums] = useState([]);
    const { id } = useParams();


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


    async function getAlbum() {
        let token = await getToken();
        let url = `https://api.spotify.com/v1/artists/${id}/albums`

        const resp = await fetch(url, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        let data = await resp.json();


        setAlbums(data.items)

    };

    useEffect(() => {

        getAlbum();
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto p-8">
                <Link to="/" className="  mb-4 inline-block bg-gray-800 p-4 rounded-md">
                    Voltar para a página inicial
                </Link>
                <h1 className="text-4xl font-extrabold mb-8">Álbuns do Artista</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {albums.map((album) => (
                        <Link to={`/album/${album.name}/${album.id}`} key={album.id} className="bg-gray-800 rounded-md overflow-hidden">
                            <img src={album.images[0]?.url} alt={album.name} className="w-full h-64 object-cover" />
                            <div className="p-4">
                                <p className="text-xl font-bold mb-2">{album.name}</p>
                                <p className="text-gray-400">{album.release_date.split('-')[0]}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
import { Link } from "react-router-dom"


export default function Home() {

    const CLIENT_ID = "**********************";
    const CLIENT_SECRET = "******************";

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

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

    async function getArtista() {
        let token = await getToken();

        let url = `https://api.spotify.com/v1/search?q=${query}&type=artist`;

        const resp = await fetch(url, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        let data = await resp.json();

        setResults(data.artists.items);
    }





    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md">
                <h1 className="text-3xl font-extrabold text-white mb-4">Pesquisa Spotify</h1>
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Digite o nome do artista ou banda"
                        className="w-full py-2 px-4 mr-2 bg-gray-700 text-white rounded-md focus:outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        className="bg-green-500 py-2 px-4 rounded-md focus:outline-none hover:bg-green-600"
                        onClick={getArtista}
                    >
                        Pesquisar
                    </button>
                </div>
                <div className="mt-4">
                    {results.map((artist) => (
                        <Link to={`/artista/${artist.id}`}>
                            <div key={artist.id} className="text-white flex flex-row gap-4 items-center m-9">
                                <img className="w-16 h-16 rounded-full object-cover" src={artist.images[2]?.url} alt="" />
                                <h3>{artist.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

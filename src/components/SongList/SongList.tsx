import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchResults } from '../../redux/store';
import { useAppDispatch } from '../../redux/store';
import styled from "styled-components";
import InfiniteScroll from 'react-infinite-scroll-component';

import "./SongList.css";
import LoaderComponent from './../Loader/Loader'

interface State {
    searchTerm: string;
    results: Array<any>;
    loading: boolean;
    error: any;
}


export default function SongListComponent() {
    const [inputValue, setInputValue] = useState<string>('');
    const state = useSelector((state: State) => state);
    const dispatch = useAppDispatch();
    const [currentAudio, setCurrentAudio] = useState<any>(null);

    const [offset, setOffset] = useState(10);

    const Wrapper = styled.div`width: 100px; margin: auto; padding: 30px 0px;`;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        (!inputValue) && setInputValue("akon");
        dispatch(fetchResults(inputValue, offset));
    };

    const clearAllPlayAudios = (removeEl: string, className: string) => {
        const divs: any = document.getElementsByClassName(removeEl);
        for (let i = 0; i < divs.length; i++) {
            divs[i].classList.remove(className);
        }
    };

    const audioBtnHandler = (audioElement:any, addClassEl:string, removeClassEl:string) => {
        audioElement.closest('.songlist-wrapper').classList.add(addClassEl);
        audioElement.closest('.songlist-wrapper').classList.remove(removeClassEl);
    }

    const handleAudioClick = (audio: any) => {
        const audioEL: any = audio as HTMLAudioElement;

        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
        }

        if (audioEL.paused) {
            clearAllPlayAudios('songlist-wrapper', 'playing');
            audioBtnHandler(audioEL, 'playing', 'pause');
            audioEL.play();
            setCurrentAudio(audio);
        } else {
            clearAllPlayAudios('songlist-wrapper', 'pause');
            audioBtnHandler(audioEL, 'pause', 'playing');
            audioEL.pause();
            setCurrentAudio(null);
        }
    };

    const fetchData = () => {
        setTimeout(() => {
            setOffset(offset + 10);
          }, 1000);     
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="search-box">
                    <input type="text" value={inputValue} placeholder="Search your favorite songs, album, artists.." onChange={handleInputChange} id="searchInput" />
                    <button type="submit" className="search-btn"><span className="material-icons material-symbols-outlined search-icon">search</span></button>
                </div>
            </form>

            {state.loading && <div className="page-loader"><LoaderComponent /></div>}

            {state.error && <div>Error: {state.error}</div>}

            <InfiniteScroll
                dataLength={offset}
                next={fetchData}
                hasMore={state.results.length > offset}
                loader={<LoaderComponent />}
            >             
            {state.results.slice(0, offset).map((result: any, index: any) => (
                <div key={result.trackId} className="songlist-wrapper">
                    <img src={result.artworkUrl60} alt={result.trackName} className="img-avatar" />
                    <div className="album-list">
                        <h4 className="albumname">{result.artistName}</h4>
                        <p>{result.collectionName}</p>
                    </div>
                    <div className="audio-controls">
                        <div onClick={() => handleAudioClick(document.getElementsByTagName('audio')[index])}>
                            <div className="material-icons audio-btn play-btn">play_circle</div>
                            <div className="material-icons audio-btn pause-btn">pause_circle</div>
                        </div>

                    </div>
                    <audio
                        controls
                        src={result.previewUrl}
                    >
                    </audio>
                </div>
            ))}
            </InfiniteScroll>
        </div>
    );
}
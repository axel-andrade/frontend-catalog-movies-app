import React, { useEffect, useState } from 'react';
import { Layout, Input, Empty, Spin } from 'antd';
import MovieDrawer from './MovieDrawer';
import ArctistDrawer from './ArctistDrawer';
import MovieDetailModal from './MovieDetailModal';
import { Link } from 'react-router-dom';
import utils from '../utils';
import { Container, Button as ButtonFloating, Link as LinkFloating } from 'react-floating-action-button'

import './Main.css';
import api from '../services/api';
import logo from '../assets/logo.png';
import placeholder_poster from '../assets/placeholder_poster.jpg';

import { VideoCameraAddOutlined, UsergroupAddOutlined, PlusOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Search } = Input;


export default function Main({ history }) {
    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState(null);
    const [limit, setLimit] = useState(10000);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [movieSelected, setMovieSelected] = useState({});
    const [showOptions, setShowOptions] = useState(false);

    const changeFAButton = () => {
        setRotate(!rotate);
        setShowOptions(!showOptions);
    };

    async function getSearchedMovies(value) {
        try {
            if (value !== '') {
                setSearch(value);
                setLoading(true);
                loadMovies(value);
            }
        } catch (error) {
            setLoading(false);
            setMovies([]);
            console.log(error);
        }
    }

    async function loadMovies(text) {
        try {
            setLoading(true);
            setSearch('')
            const url = (`/movies?limit=${limit}&page=${page}`).concat(text ? `&search=${text}` : '');
            console.log('url: ', url);
            const response = await api.get(url);
            setMovies(response.data.movies);
            setLoading(false);
        } catch (e) {
            setMovies([]);
            setLoading(false);
        }
    }

    const showMovieDrawer = () => {
        setVisible1(true);
    };

    const showArctistDrawer = () => {
        setVisible2(true);
    };

    const closeMovieDrawer = async () => {
        setVisible1(false);
        loadMovies();
    }

    const closeArctistDrawer = async () => {
        setVisible2(false);
    };

    const configModal = (movie) => {
        setMovieSelected(movie);
        setVisible3(true);
    };

    // chamada api
    useEffect(() => {
        loadMovies();
    }, [visible1, visible2, visible3]);

    return (
        <Layout className="main-container" style={{ background: '#243447' }}>

            <Link to="/">
                <img src={logo} alt="Movie Catalog" width='50px' height='50px' />
            </Link>
            <Search
                placeholder="Busque um filme"
                onSearch={value => getSearchedMovies(value)}
                onChange={e => getSearchedMovies(e.target.value)}
                style={{ width: '100%', height: '50px', marginBottom: '20px', marginTop: '30px' }}
            />
            <h4 style={{ color: '#FFFFFF' }}>
                {movies.length > 0 ? movies.length === 1 ? '1 resultado' : `${movies.length} resultados` : null}
            </h4>

            {movies.length > 0 ? (
                <ul>
                    {movies.map(movie => (
                        <li key={movie.id} onClick={() => configModal(movie)}>
                            <img src={
                                utils.checkURLImageIsValid(movie.url_poster)
                                    ? movie.url_poster
                                    : placeholder_poster
                            } alt={movie.title} />
                            <footer>
                                <strong>{movie.title}</strong>
                                <p>{movie.description}</p>
                            </footer>
                        </li>
                    ))}
                </ul>

            ) : (
                    loading
                        ? <Spin />
                        : <Layout style={{ marginTop: '20%', background: '#243447' }}>
                            <Empty
                                description='Ainda não existem filmes cadastrados'
                            />
                        </Layout>
                )}

            <MovieDrawer visible={visible1} showDrawer={showMovieDrawer} closeDrawer={closeMovieDrawer} />
            <ArctistDrawer visible={visible2} showDrawer={showArctistDrawer} closeDrawer={closeArctistDrawer} />
            <MovieDetailModal movie={movieSelected} visible={visible3} closeModal={() => setVisible3(false)} />

            <Container>
                {showOptions ?
                    <Layout style={{ background: 'transparent' }}>
                        <Layout style={{ background: 'transparent' }} onClick={() => showArctistDrawer()}>
                            <LinkFloating href="#"
                                tooltip="Adicionar artista"
                            >
                                <UsergroupAddOutlined />
                            </LinkFloating>
                        </Layout>
                        <Layout style={{ background: 'transparent' }} onClick={() => showMovieDrawer()}>
                            <LinkFloating tooltip="Adicionar filmes" >
                                <VideoCameraAddOutlined />
                            </LinkFloating>
                        </Layout>
                    </Layout>
                    : null
                }
                <ButtonFloating
                    rotate={rotate}
                    onClick={() => changeFAButton()}>
                    <PlusOutlined />
                </ButtonFloating>
            </Container>
            {/* <Footer style={{ textAlign: 'center', marginTop: '50px', background: '#243447' }}>
                <h4 style={{ color: '#FFFFFF', fontSize: 10 }}>
                    Movie Catalog ©2020 Created by Axel Andrade
                </h4>
            </Footer> */}
        </Layout>
    )

}
import React, { useEffect, useState } from 'react';
import { Modal, Button, Layout, List, Typography, Divider, Avatar, Drawer } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import utils from '../utils';
import api from '../services/api';
import MovieDrawerEdit from './MovieDrawerEdit';
import placeholder_poster from '../assets/placeholder_poster.jpg';


export default function MovieDetailModal({ movie, visible, closeModal }) {

    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [visibleDrawerEdit, setVisibleDrawerEdit] = useState(false);

    const showModal = () => {

    };

    const generateListItem = (key, value) => {
        return (
            <List.Item style={{ alignItems: 'start' }}>
                <Typography.Text style={{ fontWeight: 'bold' }}>{key}</Typography.Text>
                {value}
            </List.Item>
        );
    };

    const deleteMovie = async () => {
        try {
            setLoading(true);
            await api.delete(`/movies/${movie.id}`);
            utils.openNotificationWithIcon('success', 'Filme deletado com sucesso');
            setLoading(false);
            closeModal();
        } catch (e) {
            setLoading(false);
            utils.openNotificationWithIcon('error', 'Erro ao deletar este filme');
        }
    };

    const showMovieEditDrawer = () => {
        setVisibleDrawerEdit(true);
    };

    const closeMovieEditDrawer = e => {
        setVisibleDrawerEdit(false);
    };

    return (

        <Drawer
            title=""
            width={720}
            onClose={closeModal}
            visible={visible}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >

                    <Button onClick={() => closeModal()} type="primary" style={{ background: '#f44336', borderColor: '#f44336' }}>
                        Fechar
              </Button>
                </div>
            }
        >
            <Layout style={{ flexDirection: 'row', backgroundColor: 'transparent', alignItems: 'end' }}>
                <Button style={{ borderColor: '#4c4cff' }} onClick={() => setVisibleDrawerEdit(true)}>
                    <EditOutlined size={70} style={{ marginBottom: '20px', color: '#4c4cff' }} />
                </Button>

                <Button style={{ borderColor: 'red', marginLeft: '20px' }} onClick={() => deleteMovie()}>
                    <DeleteOutlined size={70} style={{ marginBottom: '20px', color: 'red' }} />
                </Button>
            </Layout>
            <Layout style={{ background: 'transparent', marginTop: '20px' }}>
                <Layout style={{ alignItems: 'center', background: 'transparent' }}>
                    <li key={movie.id}>
                        <img src={
                            utils.checkURLImageIsValid(movie.url_poster)
                                ? movie.url_poster
                                : placeholder_poster
                        }
                            width='300px'
                            height='400px'
                            alt={movie.title} />
                    </li>
                </Layout>
                <Layout style={{ alignItems: 'start', marginTop: '20px', background: 'transparent' }}>
                    <Divider orientation="left" style={{ fontWeight: 'bold' }}>Informações</Divider>
                    <List
                        bordered
                        style={{ width: '100%' }}
                    >
                        {generateListItem('Título:   ', movie.title)}
                        {generateListItem('Título original:   ', movie.original_title)}
                        {generateListItem('Descrição:   ', movie.description)}
                        {generateListItem('Idioma:   ', movie.language)}
                        {generateListItem('Duração:   ', JSON.stringify(movie.duration_minutes))}
                        {generateListItem('Classificação:   ', movie.age_range === "free" ? "Livre" : movie.age_range)}
                        {generateListItem('Data de lançamento:   ', utils.formatDate(new Date(movie.release_date)))}
                        {generateListItem('Ano de produção:   ', JSON.stringify(Math.abs(movie.year)))}
                    </List>
                    <Divider orientation="left" style={{ fontWeight: 'bold' }}>Direção</Divider>
                    {movie.directors && movie.directors.length > 0 ?
                        <List
                            itemLayout="horizontal"
                            dataSource={movie.directors || []}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.star.profile_image} />}
                                        title={item.star.artistic_name}
                                    />
                                </List.Item>
                            )}
                        /> : null}
                    <Divider orientation="left" style={{ fontWeight: 'bold' }}>Escrito Por</Divider>
                    {movie.writers && movie.writers.length > 0 ?
                        <List
                            itemLayout="horizontal"
                            dataSource={movie.writers}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.star.profile_image} />}
                                        title={item.star.artistic_name}
                                    />
                                </List.Item>
                            )}
                        /> : null}
                    <Divider orientation="left" style={{ fontWeight: 'bold', borderBlockColor: '#f44336' }}>Escrito Por</Divider>
                    {movie.actors && movie.actors.length > 0 ?
                        <List
                            itemLayout="horizontal"
                            dataSource={movie.actors}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.star.profile_image} />}
                                        title={item.star.artistic_name}
                                    />
                                </List.Item>
                            )}
                        /> : null}

                </Layout>
            </Layout>
            <MovieDrawerEdit movie={movie} visible={visibleDrawerEdit} showDrawer={showMovieEditDrawer} closeDrawer={closeMovieEditDrawer} />

        </Drawer >
    );
}
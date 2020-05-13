import React, { useEffect, useState } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Layout, InputNumber } from 'antd';
import api from '../services/api';
import utils from '../utils';

const { Option } = Select;

export default function MovieDrawerEdit({ movie, visible, showDrawer, closeDrawer }) {
    const [title, setTitle] = useState(movie.title);
    const [original_title, setOriginalTitle] = useState(movie.original_title);
    const [description, setDescription] = useState(movie.description);
    const [language, setLanguage] = useState(movie.language);
    const [age_range, setAgeRange] = useState(movie.age_range === 'free' ? 'Livre' : movie.age_range);
    const [url_poster, setUrlPoster] = useState(movie.url_poster);
    const [url_trailer, setUrlTrailer] = useState(movie.url_trailer);
    const [duration_minutes, setDurationMinutes] = useState(movie.duration_minutes);
    const [year, setYear] = useState(movie.year);
    const [release_date, setReleaseDate] = useState(new Date(movie.release_date).toISOString());

    const [directors, setDirectors] = useState(movie.directors || []);
    const [selectDirectors, setSelectDirectors] = useState([]);
    const [defaultDirectors, setDefaultDirectors] = useState([]);
    const [writers, setWriters] = useState(movie.writers || []);
    const [selectWriters, setSelectWriters] = useState([]);
    const [defaultWriters, setDefaultWriters] = useState([]);
    const [actors, setActors] = useState(movie.writers || []);
    const [selectActors, setSelectActors] = useState([]);
    const [defaultActors, setDefaultActors] = useState([]);

    const [loading, setLoading] = useState(null);

    const initSelectedFields = () => {
        console.log('Movie: ', movie);
        if (directors) {
            setSelectDirectors(
                directors.map(item => item.id)
            );
            setDefaultDirectors(
                directors.map(item => item.star.artistic_name)
            );
        }
        if (actors) {
            setSelectActors(
                actors.map(item => item.id)
            );
            setDefaultActors(
                actors.map(item => item.star.artistic_name)
            );
        }
        if (writers) {
            setSelectWriters(
                writers.map(item => item.id)
            );
            setDefaultWriters(
                writers.map(item => item.star.artistic_name)
            );
        }
    };

    const handleUpdateMovie = async () => {
        await updateMovie();
    };

    function handleChange(value, type) {
        switch (type) {
            case 'actor':
                setSelectActors(value);
                break;
            case 'director':
                setSelectDirectors(value);
                break;
            case 'writer':
                setSelectWriters(value);
            default: break;
        }
        console.log(`selected ${JSON.stringify(value)}`);
    };

    const loadArtistics = async () => {
        const formatOptions = (objects, set) => {
            const children = [];
            for (let i = 0; i < objects.length; i++) {
                children.push(<Option key={objects[i].id.toString()}>{objects[i].star.artistic_name}</Option>);
            }
            set(children);
        };
        const actors = await api.get('/actors');
        const directors = await api.get('/directors');
        const writers = await api.get('/writers');

        formatOptions(actors.data, setActors);
        formatOptions(directors.data, setDirectors);
        formatOptions(writers.data, setWriters);
    };

    useEffect(() => {
        initSelectedFields();
        loadArtistics();
    }, []);

    const saveArctists = async (movie_id) => {
        const endpoint = `/movies/${movie_id}`;
        if (actors.length > 0 && selectActors.length > 0) {
            const array = selectActors.map(item => {
                if (typeof parseInt(item) === "number" && !isNaN(parseInt(item))) {
                    return item;
                }
                else {
                    const actor = actors.find(({ artistic_name }) => artistic_name === item);
                    if (actor) {
                        return actor.id;
                    }
                }
            });
            await api.post(endpoint + '/actors', { ids: array });
        }
        if (directors.length > 0 && selectDirectors > 0) {
            const array = selectDirectors.map(item => {
                if (typeof parseInt(item) === "number" && !isNaN(parseInt(item))) {
                    return item;
                }
                else {
                    const director = directors.find(({ artistic_name }) => artistic_name === item);
                    if (director) {
                        return director.id;
                    }
                }
            });
            await api.post(endpoint + '/directors', { ids: array });
        }
        if (writers.length > 0 && selectWriters > 0) {
            const array = selectWriters.map(item => {
                if (typeof parseInt(item) === "number" && !isNaN(parseInt(item))) {
                    return item;
                }
                else {
                    const writer = writers.find(({ artistic_name }) => artistic_name === item);
                    if (writer) {
                        return writer.id;
                    }
                }
            });
            await api.post(endpoint + '/writers', { ids: array });
        }
    };

    const updateMovie = async () => {
        try {
            setLoading(true);
            const data = {
                title,
                original_title,
                description,
                language,
                url_poster,
                url_trailer,
                duration_minutes,
                year,
                age_range: age_range === 'Livre' ? 'free' : age_range,
                release_date: new Date(release_date).getTime()
            };

            const response = await api.put(`/movies/${movie.id}`, data);
            const movie_id = response.data.id;
            await saveArctists(movie_id);
            utils.openNotificationWithIcon('success', 'Filme alterado com sucesso');
            setLoading(false);
            closeDrawer();
        } catch (e) {
            setLoading(false);
            utils.openNotificationWithIcon('error', 'Erro ao alterar este filme');
        }
    }

    return (
        <Layout >
            <Drawer
                title="Editando dados de um filme"
                width={720}
                onClose={closeDrawer}
                visible={visible}
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={() => closeDrawer(true)} style={{ marginRight: 8 }}>
                            Voltar
              </Button>
                        <Button onClick={() => handleUpdateMovie()} type="primary" style={{ background: '#f44336', borderColor: '#f44336' }}>
                            Alterar
              </Button>
                    </div>
                }
            >

                <Form layout="vertical" hideRequiredMark style={{ marginTop: '30px' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="title"
                                label="Título"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <Input
                                    placeholder="Por favor digite o titulo"
                                    value={title}
                                    defaultValue={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="originalType"
                                label="Título Original"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <Input
                                    placeholder="Por favor digite o titulo original"
                                    value={original_title}
                                    defaultValue={original_title}
                                    onChange={e => setOriginalTitle(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="url_poster"
                                label="Link do poster"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <Input
                                    placeholder="Por favor insira o link do poster"
                                    value={url_poster}
                                    defaultValue={url_poster}
                                    onChange={e => setUrlPoster(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="url_trailer"
                                label="Link do trailer"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <Input
                                    placeholder="Por favor insira o link do trailer"
                                    value={url_trailer}
                                    defaultValue={url_trailer}
                                    onChange={e => setUrlTrailer(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="age_range"
                                label="Faixa etária"
                                rules={[{ required: true, message: 'Please select an owner' }]}
                            >
                                <Select
                                    placeholder="Por favor selecione a faixa etária"
                                    value={age_range}
                                    defaultValue={age_range}
                                    onChange={value => setAgeRange(value)}
                                >
                                    <Option value="free">Livre</Option>
                                    <Option value="+12">+12</Option>
                                    <Option value="+14">+14</Option>
                                    <Option value="+18">+18</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="release_date"
                                label="Data de lançamento"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    getPopupContainer={trigger => trigger.parentNode}
                                    placeholder='Por favor selecione a data de lançamento'
                                    value={release_date}
                                    defaultPickerValue={new Date(release_date)}
                                    onChange={value => setReleaseDate(value)}

                                />

                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="year"
                                label="Ano de produção"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder='Por favor digite o ano de produção'
                                    value={year}
                                    maxLength={4}
                                    minLength={4}
                                    onChange={value => setYear(value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="duration_minutes"
                                label="Duração"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder='Por favor digite a duração em minutos'
                                    value={duration_minutes}
                                    maxLength={8}
                                    defaultValue={duration_minutes}
                                    onChange={e => setDurationMinutes(e)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="language"
                                label="Nacionalidade"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <Input
                                    placeholder="Por favor digite a nacionalidade"
                                    value={language}
                                    defaultValue={language}
                                    onChange={e => setLanguage(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Descrição"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Campo obrigatório',
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Por favor digite a descrição"
                                    value={description}
                                    defaultValue={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="directors"
                                label="Diretores (Opcional)"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Por favor selecione os diretores',
                                        type: 'array',
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Por favor selecione os diretores"
                                    onChange={value => handleChange(value, 'director')}
                                    defaultValue={defaultDirectors}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {directors}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="writers"
                                label="Escritores (Opcional)"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Por favor selecione os escritores',
                                        type: 'array',
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Por favor selecione os escritores"
                                    onChange={value => handleChange(value, 'writer')}
                                    defaultValue={defaultWriters}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {writers}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="actors"
                                label="Elenco (Opcional)"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Por favor selecione os atores/atrizes',
                                        type: 'array',
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Por favor selecione os atores/atrizes"
                                    onChange={value => handleChange(value, 'actor')}
                                    defaultValue={defaultActors}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {actors}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </Layout>
    );
}

import React, { useEffect, useState } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Layout, InputNumber } from 'antd';
import api from '../services/api';
import utils from '../utils';

const { Option } = Select;

export default function MovieDrawer({ visible, showDrawer, closeDrawer }) {
    const [title, setTitle] = useState('');
    const [original_title, setOriginalTitle] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [age_range, setAgeRange] = useState('');
    const [url_poster, setUrlPoster] = useState('');
    const [url_trailer, setUrlTrailer] = useState('');
    const [duration_minutes, setDurationMinutes] = useState(null);
    const [year, setYear] = useState(null);
    const [release_date, setReleaseDate] = useState(null);

    const [directors, setDirectors] = useState([]);
    const [selectDirectors, setSelectDirectors] = useState([]);
    const [writers, setWriters] = useState([]);
    const [selectWriters, setSelectWriters] = useState([]);
    const [actors, setActors] = useState([]);
    const [selectActors, setSelectActors] = useState([]);

    const [loading, setLoading] = useState(null);

    const handleCreateMovie = async () => {
        await createMovie();
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
        loadArtistics();
    }, []);

    const saveArctists = async (movie_id) => {
        const endpoint = `/movies/${movie_id}`;
        if (actors.length > 0 && selectActors.length > 0) {
            await api.post(endpoint + '/actors', { ids: selectActors });
        }
        if (directors.length > 0 && selectDirectors.length > 0) {
            await api.post(endpoint + '/directors', { ids: selectDirectors });
        }
        if (writers.length > 0 && selectWriters.length > 0) {
            await api.post(endpoint + '/writers', { ids: selectWriters });
        }
    };

    const createMovie = async () => {
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
            let invalidFields = false;
            const arrayFields = Object.keys(data);

            for (let i = 0; i < arrayFields.length; i++) {
                if (!data[arrayFields[i]]) {
                    invalidFields = true;
                    break;
                }
            }

            if (invalidFields) {
                utils.openNotificationWithIcon('error', 'Preecha todos os campos');
            } else {
                const response = await api.post('/movies',
                    {
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
                    }
                );
                const movie_id = response.data.id;
                console.log("MovieId: ", movie_id)
                await saveArctists(movie_id);
                utils.openNotificationWithIcon('success', 'Filme cadastrado com sucesso');
                setLoading(false);
                closeDrawer();

            }
        } catch (e) {
            setLoading(false);
            utils.openNotificationWithIcon('error', 'Erro ao cadastrar este filme');
        }
    }
    return (
        <Layout >
            <Drawer
                title="Cadastrando um novo filme"
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
                        <Button onClick={() => handleCreateMovie()} type="primary" style={{ background: '#f44336', borderColor: '#f44336' }}>
                            Cadastrar
              </Button>
                    </div>
                }
            >
                <Form layout="vertical" hideRequiredMark>
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
                                    defaultValue={year}
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

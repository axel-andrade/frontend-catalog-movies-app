import React, { useEffect, useState } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Layout, InputNumber } from 'antd';
import api from '../services/api';
import utils from '../utils';

const { Option } = Select;

export default function ArctistDrawer({ visible, showDrawer, closeDrawer }) {
    const [artistic_name, setArctistName] = useState('');
    const [profile_image, setProfileImage] = useState('');
    const [bio, setBio] = useState('');
    const [height_meters, setHeightMeters] = useState('');
    const [specialties, setSpecialties] = useState('');
    const [gender, setGender] = useState('');
    const [birth_name, setBirthName] = useState('');
    const [birth_date, setBirthDate] = useState(null);
    const [birth_city, setBirthCity] = useState('');
    const [birth_state, setBirthState] = useState('');
    const [birth_country, setBirthCountry] = useState('');

    const [loading, setLoading] = useState(null);

    const handleCreateArctist = async () => {
        await createArctist();
    };

    const verifyFields = (data) => {
        let invalidFields = false;
        const arrayFields = Object.keys(data);
        console.log(JSON.stringify(arrayFields));
        for (let i = 0; i < arrayFields.length; i++) {
            if (!data[arrayFields[i]]) {
                invalidFields = true;
                break;
            }
        }
        console.log(JSON.stringify(invalidFields));
        return invalidFields;
    };

    const createArctist = async () => {
        try {
            setLoading(true);
            const data = {
                artistic_name,
                profile_image,
                bio,
                height_meters,
                specialties,
                gender,
                birth_name,
                birth_date: new Date(birth_date).getTime(),
                birth_city,
                birth_state,
                birth_country
            };

            console.log(data);

            if (verifyFields(data)) {
                utils.openNotificationWithIcon('error', 'Preencha todos os campos');
            }
            else {
                data.height_meters = parseFloat(data.height_meters) || 0.0;
                const response = await api.post('/stars', data);
                utils.openNotificationWithIcon('success', 'Artista cadastrado com sucesso');
                setLoading(false);
                closeDrawer();
            }
        } catch (e) {
            console.log(e);
            setLoading(false);
            utils.openNotificationWithIcon('error', 'Erro ao cadastrar este artista');
        }
    };

    return (
        <Layout >
            <Drawer
                title="Cadastrando um(a) novo(a) artista"
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
                        <Button onClick={() => handleCreateArctist()} type="primary" style={{ background: '#f44336', borderColor: '#f44336' }}>
                            Cadastrar
              </Button>
                    </div>
                }
            >
                <Form layout="vertical" hideRequiredMark>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="artistic_name"
                                label="Nome artístico"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <Input
                                    placeholder="Por favor digite o nome artístico"
                                    value={artistic_name}
                                    defaultValue={artistic_name}
                                    onChange={e => setArctistName(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="profile_image"
                                label="Link da foto de perfil"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <Input
                                    placeholder="Por favor insira o link da foto de perfil"
                                    value={profile_image}
                                    defaultValue={profile_image}
                                    onChange={e => setProfileImage(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="birth_name"
                                label="Nome de nascimento"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <Input
                                    placeholder="Por favor digite o nome de nascimento"
                                    value={birth_name}
                                    defaultValue={birth_name}
                                    onChange={e => setBirthName(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="birth_date"
                                label="Data de nascimento"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    getPopupContainer={trigger => trigger.parentNode}
                                    placeholder='Por favor selecione a data de nascimento'
                                    value={birth_date}
                                    onChange={value => setBirthDate(value)}

                                />

                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="birth_city"
                                label="Cidade de nascimento"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <Input
                                    placeholder="Por favor digite a cidade de nascimento"
                                    value={birth_city}
                                    defaultValue={birth_city}
                                    onChange={e => setBirthCity(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="birth_state"
                                label="Estado de nascimento"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <Input
                                    placeholder="Por favor insira o estado de nascimento"
                                    value={birth_state}
                                    defaultValue={birth_state}
                                    onChange={e => setBirthState(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="birth_country"
                                label="País de nascimento"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <Input
                                    placeholder="Por favor insira país de nascimento"
                                    value={birth_country}
                                    defaultValue={birth_country}
                                    maxLength={3}
                                    onChange={e => setBirthCountry(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="height_meters"
                                label="Altura em metros"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <Input
                                    placeholder="Por favor insira a altura"
                                    value={height_meters}
                                    defaultValue={height_meters}
                                    maxLength={4}
                                    onChange={e => setHeightMeters(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="gender"
                                label="Gênero"
                                rules={[{ required: true, message: 'Campo obrigatório' }]}
                            >
                                <Select
                                    placeholder="Por favor selecione o gênero"
                                    value={gender}
                                    onChange={value => setGender(value)}
                                >
                                    <Option value="female">Feminino</Option>
                                    <Option value="male">Masculino</Option>
                                    <Option value="outher">Outro</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="bio"
                                label="Bio"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Campo obrigatório',
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Por favor digite a bio"
                                    value={bio}
                                    defaultValue={bio}
                                    onChange={e => setBio(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="specialties"
                                label="Especialidades"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Campo obrigatório',
                                        type: 'array',
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Por favor selecione as especialidades"
                                    onChange={(value) => setSpecialties(value)}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key="actor">Ator/Atriz</Option>
                                    <Option key="director">Diretor(a)</Option>
                                    <Option key="writer">Escritor(a)</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </Layout >
    );
}

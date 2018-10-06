import React from "react"
import { Link } from "react-router-dom"
import config from "../config"
import { Row, Col, Icon, Card, Breadcrumb } from "antd"
import styled, { keyframes } from "styled-components"
import { zoomIn } from "react-animations"
import "./Contact.css"
import { Map, Marker, GoogleApiWrapper } from "google-maps-react"

const zoomInAnimation = keyframes`${zoomIn}`

const ContactCard = styled(Card)`
  animation: 1.5s ${zoomInAnimation};
  margin: 55% 0 5% 0 !important;
  @media only screen and (max-width: 320px) {
    margin: 150% 0 0 0 !important;
  }
  @media only screen and (min-width: 321px) and (max-width: 375px) {
    margin: 105% 0 0 0 !important;
  }
  @media only screen and (min-width: 376px) and (max-width: 414px) {
    margin: 95% 0 0 0 !important;
  }
  @media only screen and (min-width: 415px) and (max-width: 840px) {
    margin: 70% 0 0 0 !important;
  }
`

const IconRow = styled(Row)`
  margin-top: 25px;
  @media only screen and (min-width: 481px) and (max-width: 768px) {
    margin-top: 50px;
  }
`

const BreadCrumbs = styled(Row)`
  color: #331507;
  margin-top: 80px;
`

const CardRow = styled(Row)`
  margin: 30px 0 0;
`

const ActionSpan = styled.p`
  margin: 15px;
  font-size: 1.2rem;
  color: #331507;
  @media only screen and (max-width: 768px) {
    font-size: 1rem;
  }
  @media only screen and (max-width: 480px) {
    font-size: 0.7rem;
    margin: 0;
  }
  a {
    text-decoration: none;
    :visited,
    :active,
    :hover {
      text-decoration: none;
    }
  }
`

const TableCell = styled.p`
  color: #331507;
  margin-bottom: 0;
  @media only screen and (min-width: 769px) {
    margin-top: 5px;
  }
`

const GoogleMap = styled(Map)`
  animation: 1.5s ${zoomInAnimation};
  height: 50% !important;
`

const FbIcon = styled(Icon)`
  font-size: 28px;
  color: #3b5998;
  @media only screen and (min-width: 481px) and (max-width: 768px) {
    font-size: 26px;
  }
  @media only screen and (max-width: 480px) {
    font-size: 18px;
  }
`

const MailIcon = styled(Icon)`
  font-size: 28px;
  @media only screen and (min-width: 481px) and (max-width: 768px) {
    font-size: 26px;
  }
  @media only screen and (max-width: 480px) {
    font-size: 18px;
    margin-top: 2px;
  }
`

const PhIcon = styled(Icon)`
  font-size: 28px;
  color: #fb3958;
  @media only screen and (min-width: 481px) and (max-width: 768px) {
    font-size: 26px;
  }
  @media only screen and (max-width: 480px) {
    font-size: 18px;
  }
`

const InstaIcon = styled(Icon)`
  font-size: 28px;
  color: rgba(252,63,116,1);
  @media only screen and (min-width: 481px) and (max-width: 768px) {
    font-size: 26px;
  }
  @media only screen and (max-width: 480px) {
    font-size: 18px;
    margin-top: 2px;
  }
`

const HoursRow = styled(Row)`
  margin: 10px;
  text-align: center;
  @media screen and (max-width: 768px) {
    margin: 10px 0 80px;
  }
`;

class Contact extends React.Component {
  handleClick = event => {
    event.preventDefault();
    this.props.history.push("/");
  };

  render() {
    return (
      <div>
        <IconRow className="is-hidden-tablet">
          <Icon onClick={this.handleClick} className="icon-back" type="left" />
        </IconRow>
        <BreadCrumbs className="is-hidden-mobile">
          <Breadcrumb style={{ fontSize: 17 }} separator=">">
            <Breadcrumb.Item>
              <Link to="/">Новинки</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link className="active-link" to="#">
                Контакт
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </BreadCrumbs>
        <CardRow>
          <Col
            xs={{ span: 22, offset: 1 }}
            sm={{ span: 20, offset: 2 }}
            md={{ span: 18, offset: 3 }}
          >
            <GoogleMap
              google={this.props.google}
              zoom={15}
              initialCenter={{
                lat: 55.715226,
                lng: 37.797472
              }}
            >
              <Marker
                title={"Все Булочки Тут"}
                name={"Все Булочки Тут"}
                position={{ lat: 55.715226, lng: 37.797472 }}
              />
              <Marker />
            </GoogleMap>
            <ContactCard
              title={
                <p
                  style={{
                    textAlign: "center",
                    whiteSpace: "normal",
                    marginBottom: 0
                  }}
                >
                  "БУЛОЧНАЯ" Рязанский Пр-т 58/1
                </p>
              }
              actions={[
                <a
                  href="https://www.facebook.com/CONFERTRU.RU/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FbIcon type="facebook" />
                  <ActionSpan>все булочки тут</ActionSpan>
                </a>,
                <a
                  href="https://www.instagram.com/confertru.ru/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstaIcon type="instagram" />
                  <ActionSpan>confertru.ru</ActionSpan>
                </a>,
                <a
                  href="https://www.instagram.com/vse_bulochki_tut/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstaIcon type="instagram" />
                  <ActionSpan>vse_bulochki_tut</ActionSpan>
                </a>
              ]}
            >
              <table
                style={{ margin: "0 auto" }}
                className="table is-hoverable"
              >
                <tbody>
                  <tr>
                    <td>
                      <PhIcon type="customer-service" />
                    </td>
                    <td>
                      <TableCell>
                        <a
                          href="tel:+79269823572"
                          target="_self"
                          name="phone number"
                          className="ant-btn ant-btn-primary"
                        >
                          +7 926-982-35-72
                        </a>
                      </TableCell>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <PhIcon type="customer-service" />
                    </td>
                    <td>
                      <TableCell>
                        <a
                          href="tel:+79266298726"
                          target="_self"
                          name="phone number"
                          className="ant-btn ant-btn-primary"
                        >
                          +7 926-629-87-26
                        </a>
                      </TableCell>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <MailIcon type="mail" />
                    </td>
                    <td>
                      <TableCell>
                        <a
                          className="ant-btn ant-btn-primary"
                          href="mailto:confert76@gmail.com?Subject=Контакт со службой поддержки"
                          target="_self"
                        >
                          confert76@gmail.com
                        </a>
                      </TableCell>
                    </td>
                  </tr>
                </tbody>
              </table>
            </ContactCard>
          </Col>
        </CardRow>
        <HoursRow>
          <Col
            xs={{ span: 22, offset: 1 }}
            md={{ span: 18, offset: 3 }}
            style={{ background: "rgba(234,204,178,.5)", padding: 10}}
          >
            <p className="has-text-weight-semibold">Наши часы работы:</p>
            <p>с понедельника по субботу: с 8.00 до 20.00 часов;</p>
            <p>в воскресенье: с 9.00 до 18.00 часов.</p>
          </Col>
        </HoursRow>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: config.google.API_KEY
})(Contact);

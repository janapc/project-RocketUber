import React from 'react';

import {
  Container,
  TypeTitle,
  TypeDescription,
  TypeImage,
  RequestButton,
  RequestButtonText
} from './styles';

import uberx from '../../assets/uberx.png';

export default function Details({ duration }) {
  return (
    <Container>
      <TypeTitle>Popular</TypeTitle>
      <TypeDescription>Viagens baratas para o dia a dia</TypeDescription>

      <TypeImage source={uberx} />
      <TypeTitle>UberX</TypeTitle>
      { duration &&
        <TypeDescription>
          R$ {Math.trunc(duration/10*3)}
        </TypeDescription> }

      <RequestButton onPress={() => {}}>
        <RequestButtonText>SOLICITAR UBERX</RequestButtonText>
      </RequestButton>
    </Container>
  );
}

import React from 'react';
import { View } from 'react-native';
import { color } from '../baseColor';

export const Header = () => {
  return <View style={styles.header}></View>;
};

const styles = {
  header: {
    width: '69%',
    height: '32%',
    backgroundColor: color.green,
    borderBottomRightRadius: 160,
    borderBottomLeftRadius: 160,
    borderTopRightRadius: 160,
    marginLeft: -70,
    marginTop: -70,
  },
};

import {View} from 'react-native';

type CellProps = {
  children: React.ReactNode;
};

const Cell: React.FC<CellProps> = ({children}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
      }}>
      {children}
    </View>
  );
};

export default Cell;

import { Box, Heading, Select, Input, Button, HStack, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const UserManagement: React.FC = () => {
  const { state, dispatch } = useGame();
  const [newUserName, setNewUserName] = useState('');

  const handleAddUser = () => {
    if (newUserName.trim() !== '') {
      dispatch({ type: 'ADD_USER', payload: { name: newUserName.trim() } });
      setNewUserName('');
    }
  };

  const handleSwitchUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SWITCH_USER', payload: { userId: e.target.value } });
  };

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        ユーザーせんたく
      </Heading>
      <Stack spacing={4} mb={8}>
        <Select
          placeholder="ユーザーをえらぶ"
          value={state.currentUser?.id || ''}
          onChange={handleSwitchUser}
          data-testid="user-select"
        >
          {state.users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </Select>
        <HStack>
          <Input
            placeholder="あたらしいユーザーめい"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            data-testid="new-user-input"
          />
          <Button onClick={handleAddUser} data-testid="add-user-button">ついか</Button>
        </HStack>
      </Stack>
    </Box>
  );
};

export default UserManagement;

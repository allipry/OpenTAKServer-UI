import React, { useState } from 'react';
import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Group,
  Paper,
  Text,
  Alert,
  Center,
  Loader,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconQrcode, IconCheck, IconX, IconInfoCircle } from '@tabler/icons-react';
import { QRCode } from 'react-qrcode-logo';
import Logo from '../images/ots-logo.png';
import axios from '../axios_config';
import { apiRoutes } from '../apiRoutes';

interface ItakCredentials {
  username: string;
  token: string;
}

interface ItakQRResponse {
  qr_string: string;
  server_url: string;
  connection_details: {
    server: string;
    username: string;
    token: string;
    scheme: string;
  };
  timestamp: string;
}

interface ItakQRModalProps {
  opened: boolean;
  onClose: () => void;
}

export function ItakQRModal({ opened, onClose }: ItakQRModalProps) {
  const [credentials, setCredentials] = useState<ItakCredentials>({
    username: 'admin',
    token: 'password'
  });
  const [qrData, setQrData] = useState<ItakQRResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const generateItakQR = async (credentials: ItakCredentials): Promise<ItakQRResponse> => {
    const { username, token } = credentials;
    
    try {
      // Try POST request first (preferred method)
      const response = await axios.post(apiRoutes.itakQrString, {
        username,
        token
      });
      
      if (response.status === 200) {
        return response.data;
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      // Fallback to GET request for backward compatibility
      try {
        const response = await axios.get(apiRoutes.itakQrString, {
          params: { username, token }
        });
        
        if (response.status === 200) {
          return response.data;
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      } catch (fallbackError) {
        throw new Error(`Failed to generate iTAK QR code: ${error}`);
      }
    }
  };

  const handleGenerate = async () => {
    if (!credentials.username.trim() || !credentials.token.trim()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please enter both username and token',
        color: 'red',
        icon: <IconX size={16} />
      });
      return;
    }

    setLoading(true);
    try {
      const data = await generateItakQR(credentials);
      setQrData(data);
      notifications.show({
        title: 'Success',
        message: 'iTAK QR code generated successfully',
        color: 'green',
        icon: <IconCheck size={16} />
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to generate iTAK QR code',
        color: 'red',
        icon: <IconX size={16} />
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQrData(null);
    setCredentials({ username: 'admin', token: 'password' });
    onClose();
  };

  const handleTestEndpoint = async () => {
    try {
      const response = await axios.get(apiRoutes.itakQrString);
      if (response.status === 200) {
        notifications.show({
          title: 'Test Successful',
          message: `iTAK endpoint is working. Default QR: ${response.data.qr_string?.substring(0, 50)}...`,
          color: 'green',
          icon: <IconCheck size={16} />
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Test Failed',
        message: 'iTAK endpoint test failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
        color: 'red',
        icon: <IconX size={16} />
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="iTAK QR Code Generator"
      size="lg"
      centered
    >
      <Stack gap="md">
        {!qrData ? (
          <>
            <Text size="sm" c="dimmed">
              Configure credentials for iTAK connection. These will be embedded in the QR code.
            </Text>
            
            <TextInput
              label="Username"
              placeholder="Enter username"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({
                ...prev,
                username: e.target.value
              }))}
              required
              disabled={loading}
            />
            
            <PasswordInput
              label="Token/Password"
              placeholder="Enter token or password"
              value={credentials.token}
              onChange={(e) => setCredentials(prev => ({
                ...prev,
                token: e.target.value
              }))}
              required
              disabled={loading}
            />
            
            <Alert color="blue" variant="light" icon={<IconInfoCircle size={16} />}>
              <Text size="sm">
                <strong>Security Note:</strong> These credentials will be embedded in the QR code. 
                Use unique, secure credentials for each user. The QR code uses the iTAK URL scheme: 
                <code>tak://com.atakmap.app/enroll</code>
              </Text>
            </Alert>
            
            <Group justify="space-between">
              <Button
                variant="subtle"
                onClick={handleTestEndpoint}
                disabled={loading}
                size="sm"
              >
                Test Endpoint
              </Button>
              
              <Group>
                <Button variant="subtle" onClick={handleClose} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  leftSection={loading ? <Loader size={16} /> : <IconQrcode size={16} />}
                  onClick={handleGenerate}
                  loading={loading}
                  disabled={!credentials.username.trim() || !credentials.token.trim()}
                >
                  Generate QR Code
                </Button>
              </Group>
            </Group>
          </>
        ) : (
          <>
            <Center>
              <Paper p="md" shadow="sm" withBorder>
                <QRCode
                  value={qrData.qr_string}
                  size={300}
                  quietZone={10}
                  logoImage={Logo}
                  eyeRadius={50}
                  ecLevel="M"
                  qrStyle="dots"
                  logoWidth={100}
                  logoHeight={100}
                />
              </Paper>
            </Center>
            
            <Stack gap="xs">
              <Text fw={500}>Connection Details:</Text>
              <Group gap="xs">
                <Text size="sm" fw={500}>Server:</Text>
                <Text size="sm" ff="monospace">{qrData.connection_details?.server}</Text>
              </Group>
              <Group gap="xs">
                <Text size="sm" fw={500}>Username:</Text>
                <Text size="sm" ff="monospace">{qrData.connection_details?.username}</Text>
              </Group>
              <Group gap="xs">
                <Text size="sm" fw={500}>Token:</Text>
                <Text size="sm" ff="monospace">{qrData.connection_details?.token}</Text>
              </Group>
              <Group gap="xs">
                <Text size="sm" fw={500}>URL Scheme:</Text>
                <Text size="sm" ff="monospace">{qrData.connection_details?.scheme}</Text>
              </Group>
              <Group gap="xs">
                <Text size="sm" fw={500}>Generated:</Text>
                <Text size="sm" ff="monospace">{new Date(qrData.timestamp).toLocaleString()}</Text>
              </Group>
            </Stack>
            
            <Alert color="green" variant="light" icon={<IconCheck size={16} />}>
              <Text size="sm">
                <strong>Ready to scan!</strong> Use your iTAK client to scan this QR code and connect to the server.
                The QR code contains the proper <code>tak://</code> URL scheme that iTAK expects.
              </Text>
            </Alert>
            
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                QR String: {qrData.qr_string.substring(0, 40)}...
              </Text>
              
              <Group>
                <Button variant="subtle" onClick={() => setQrData(null)}>
                  Generate New
                </Button>
                <Button onClick={handleClose}>
                  Close
                </Button>
              </Group>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}
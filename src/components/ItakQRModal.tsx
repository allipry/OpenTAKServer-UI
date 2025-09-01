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
  Tabs,
  NumberInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
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

interface AtakCredentials {
  expiry_date: string;
  max_uses: number;
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

interface AtakQRResponse {
  qr_string: string;
  server_url: string;
  expiry_date: string;
  max_uses: number;
  timestamp: string;
}

interface QRModalProps {
  opened: boolean;
  onClose: () => void;
}

export function ItakQRModal({ opened, onClose }: QRModalProps) {
  const [activeTab, setActiveTab] = useState<string | null>('itak');
  const [itakCredentials, setItakCredentials] = useState<ItakCredentials>({
    username: 'admin',
    token: 'password'
  });
  const [atakCredentials, setAtakCredentials] = useState<AtakCredentials>({
    expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    max_uses: 1
  });
  const [itakQrData, setItakQrData] = useState<ItakQRResponse | null>(null);
  const [atakQrData, setAtakQrData] = useState<AtakQRResponse | null>(null);
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

  const generateAtakQR = async (credentials: AtakCredentials): Promise<AtakQRResponse> => {
    const { expiry_date, max_uses } = credentials;
    
    try {
      const response = await axios.post('/api/atak_qr_string', {
        expiry_date,
        max_uses
      });
      
      if (response.status === 200) {
        return response.data;
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      // Fallback to GET request for backward compatibility
      try {
        const response = await axios.get('/api/atak_qr_string', {
          params: { expiry_date, max_uses }
        });
        
        if (response.status === 200) {
          return response.data;
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      } catch (fallbackError) {
        throw new Error(`Failed to generate ATAK QR code: ${error}`);
      }
    }
  };

  const handleItakGenerate = async () => {
    if (!itakCredentials.username.trim() || !itakCredentials.token.trim()) {
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
      const data = await generateItakQR(itakCredentials);
      setItakQrData(data);
      setAtakQrData(null); // Clear other QR data
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

  const handleAtakGenerate = async () => {
    if (!atakCredentials.expiry_date || !atakCredentials.max_uses) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please enter both expiry date and maximum uses',
        color: 'red',
        icon: <IconX size={16} />
      });
      return;
    }

    setLoading(true);
    try {
      const data = await generateAtakQR(atakCredentials);
      setAtakQrData(data);
      setItakQrData(null); // Clear other QR data
      notifications.show({
        title: 'Success',
        message: 'ATAK QR code generated successfully',
        color: 'green',
        icon: <IconCheck size={16} />
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to generate ATAK QR code',
        color: 'red',
        icon: <IconX size={16} />
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setItakQrData(null);
    setAtakQrData(null);
    setItakCredentials({ username: 'admin', token: 'password' });
    setAtakCredentials({
      expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      max_uses: 1
    });
    setActiveTab('itak');
    onClose();
  };

  const handleItakTestEndpoint = async () => {
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

  const handleAtakTestEndpoint = async () => {
    try {
      const response = await axios.get('/api/atak_qr_string');
      if (response.status === 200) {
        notifications.show({
          title: 'Test Successful',
          message: `ATAK endpoint is working. Default QR: ${response.data.qr_string?.substring(0, 50)}...`,
          color: 'green',
          icon: <IconCheck size={16} />
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Test Failed',
        message: 'ATAK endpoint test failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
        color: 'red',
        icon: <IconX size={16} />
      });
    }
  };

  const currentQrData = itakQrData || atakQrData;
  const isItakData = !!itakQrData;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="TAK QR Code Generator"
      size="lg"
      centered
    >
      <Stack gap="md">
        {!currentQrData ? (
          <>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List>
                <Tabs.Tab value="itak">iTAK QR Code</Tabs.Tab>
                <Tabs.Tab value="atak">ATAK QR Code</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="itak" pt="md">
                <Stack gap="md">
                  <Text size="sm" c="dimmed">
                    Configure credentials for iTAK connection. These will be embedded in the QR code.
                  </Text>
                  
                  <TextInput
                    label="Username"
                    placeholder="Enter username"
                    value={itakCredentials.username}
                    onChange={(e) => setItakCredentials(prev => ({
                      ...prev,
                      username: e.target.value
                    }))}
                    required
                    disabled={loading}
                  />
                  
                  <PasswordInput
                    label="Token/Password"
                    placeholder="Enter token or password"
                    value={itakCredentials.token}
                    onChange={(e) => setItakCredentials(prev => ({
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
                      onClick={handleItakTestEndpoint}
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
                        onClick={handleItakGenerate}
                        loading={loading}
                        disabled={!itakCredentials.username.trim() || !itakCredentials.token.trim()}
                      >
                        Generate iTAK QR Code
                      </Button>
                    </Group>
                  </Group>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="atak" pt="md">
                <Stack gap="md">
                  <Text size="sm" c="dimmed">
                    Configure certificate settings for ATAK connection. This will generate a certificate enrollment QR code.
                  </Text>
                  
                  <DateInput
                    label="Certificate Expiry Date"
                    placeholder="Select expiry date"
                    value={new Date(atakCredentials.expiry_date)}
                    onChange={(date) => setAtakCredentials(prev => ({
                      ...prev,
                      expiry_date: date ? date.toISOString().split('T')[0] : ''
                    }))}
                    required
                    disabled={loading}
                  />
                  
                  <NumberInput
                    label="Maximum Uses"
                    placeholder="Enter maximum uses"
                    value={atakCredentials.max_uses}
                    onChange={(value) => setAtakCredentials(prev => ({
                      ...prev,
                      max_uses: Number(value) || 1
                    }))}
                    min={1}
                    max={100}
                    required
                    disabled={loading}
                  />
                  
                  <Alert color="blue" variant="light" icon={<IconInfoCircle size={16} />}>
                    <Text size="sm">
                      <strong>Certificate Note:</strong> This generates a certificate enrollment QR code for ATAK clients. 
                      The certificate will be valid until the expiry date and can be used up to the maximum number of times specified.
                    </Text>
                  </Alert>
                  
                  <Group justify="space-between">
                    <Button
                      variant="subtle"
                      onClick={handleAtakTestEndpoint}
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
                        onClick={handleAtakGenerate}
                        loading={loading}
                        disabled={!atakCredentials.expiry_date || !atakCredentials.max_uses}
                      >
                        Generate ATAK QR Code
                      </Button>
                    </Group>
                  </Group>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </>
        ) : (
          <>
            <Center>
              <Paper p="md" shadow="sm" withBorder>
                <QRCode
                  value={currentQrData.qr_string}
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
              <Text fw={500}>{isItakData ? 'iTAK' : 'ATAK'} Connection Details:</Text>
              {isItakData && itakQrData ? (
                <>
                  <Group gap="xs">
                    <Text size="sm" fw={500}>Server:</Text>
                    <Text size="sm" ff="monospace">{itakQrData.connection_details?.server}</Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" fw={500}>Username:</Text>
                    <Text size="sm" ff="monospace">{itakQrData.connection_details?.username}</Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" fw={500}>Token:</Text>
                    <Text size="sm" ff="monospace">{itakQrData.connection_details?.token}</Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" fw={500}>URL Scheme:</Text>
                    <Text size="sm" ff="monospace">{itakQrData.connection_details?.scheme}</Text>
                  </Group>
                </>
              ) : atakQrData ? (
                <>
                  <Group gap="xs">
                    <Text size="sm" fw={500}>Server URL:</Text>
                    <Text size="sm" ff="monospace">{atakQrData.server_url}</Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" fw={500}>Expiry Date:</Text>
                    <Text size="sm" ff="monospace">{atakQrData.expiry_date}</Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" fw={500}>Max Uses:</Text>
                    <Text size="sm" ff="monospace">{atakQrData.max_uses}</Text>
                  </Group>
                </>
              ) : null}
              <Group gap="xs">
                <Text size="sm" fw={500}>Generated:</Text>
                <Text size="sm" ff="monospace">{new Date(currentQrData.timestamp).toLocaleString()}</Text>
              </Group>
            </Stack>
            
            <Alert color="green" variant="light" icon={<IconCheck size={16} />}>
              <Text size="sm">
                <strong>Ready to scan!</strong> Use your {isItakData ? 'iTAK' : 'ATAK'} client to scan this QR code and connect to the server.
                {isItakData && <span> The QR code contains the proper <code>tak://</code> URL scheme that iTAK expects.</span>}
              </Text>
            </Alert>
            
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                QR String: {currentQrData.qr_string.substring(0, 40)}...
              </Text>
              
              <Group>
                <Button variant="subtle" onClick={() => {
                  setItakQrData(null);
                  setAtakQrData(null);
                }}>
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
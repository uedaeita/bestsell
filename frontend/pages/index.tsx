import type { NextPage } from 'next'
import React from 'react'
import { Container, AppBar, IconButton, Toolbar, Typography, Card, CardActionArea, CardContent, CardMedia } from '@material-ui/core'
import { AccountCircle, Menu } from '@material-ui/icons';
import { useEcommerces } from '@/hooks/ecommerce';
import { useRouter } from 'next/dist/client/router';

const Home: NextPage = () => {
  const router = useRouter();

  const { data: ecommerces, isLoading } = useEcommerces();

  const handleClick = () => {
    router.push('/mercari');
  };

  if (isLoading) return null;

  return (
    <Container maxWidth="xl" disableGutters>
      <div className="flex-grow">
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton edge="start" className="mr-4" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6" className="flex-grow" noWrap>
              Best Sell
            </Typography>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">E-commerces</h2>
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {
              ecommerces && ecommerces.map(ecommerce => (
                <Card key={ecommerce.id} className="max-w-xs" onClick={handleClick}>
                  <CardActionArea>
                    <CardMedia
                      className="h-32 bg-cover"
                      image={`/bestsell/images/ecommerces/${ecommerce.code}.png`}
                      title={ecommerce.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                      {ecommerce.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))
            }
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;

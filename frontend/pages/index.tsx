import type { NextPage } from 'next'
import React from 'react'
import Image from 'next/image'
import { Container, AppBar, IconButton, Toolbar, Typography } from '@material-ui/core'
import { AccountCircle, Menu } from '@material-ui/icons';
import { useEcommerces } from '@/hooks/ecommerce';

const Home: NextPage = () => {
  const { data: ecommerces, isLoading } = useEcommerces();

  if (isLoading) return null;

  return (
    <Container maxWidth="xl" disableGutters>
      <div className="flex-grow">
        <AppBar position="static">
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
                <a href="/bestsell/mercari" className="group" key={ecommerce.code}>
                  <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                    <Image
                      src={`/images/ecommerces/${ecommerce.code}.svg`}
                      alt={ecommerce.name}
                      className="w-full h-full object-center object-cover group-hover:opacity-75"
                      width="64"
                      height="64"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">
                    {ecommerce.name}
                  </h3>
                </a>
              ))
            }
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;

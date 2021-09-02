import React from 'react';
import { Paper, InputBase, IconButton } from '@material-ui/core';
import { Search } from '@material-ui/icons';

const Searchbox = (): JSX.Element => {
  return (
    <div className="relative rounded-sm bg-white hover:bg-gray-100 ml-0 w-full">
      <div className="py-4 h-full absolute pointer-events-none flex items-center justify-center">
        <Search />
      </div>
      <InputBase
        placeholder="Search..."
        classes={{
          root: "",
          input: "px-2 pt-2 w-full",
        }}
        inputProps={{ 'aria-label': 'search' }}
      />
    </div>
  );
};

export default Searchbox;

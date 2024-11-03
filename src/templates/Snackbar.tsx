/* eslint-disable unused-imports/no-unused-vars */
import React from 'react';

type SnackbarProps = {
  title: string;
};

const Snackbar = ({ title }: SnackbarProps) => (
  <div
    className={`fixed bottom-5 left-1/2 -translate-x-1/2 transition-opacity duration-300`}
  >
    <div className="mx-auto flex w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md">
      <div className="w-2 bg-gray-800"></div>
      <div className="flex items-center px-2 py-3">
        <div className="mx-3">
          <p className="text-gray-600">{title}</p>
        </div>
      </div>
    </div>
  </div>
);

export { Snackbar };

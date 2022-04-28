import React from 'react';
import FilterExplore from '../components/FilterExplore';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function ExploreFoods() {
  return (
    <div>
      <Header title="Explore Foods" />
      <FilterExplore renderButton routeInfredientes="/explore/foods/ingredients" />
      <Footer />
    </div>
  );
}

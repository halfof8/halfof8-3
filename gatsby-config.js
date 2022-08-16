require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ACCESS_TOKEN,
  FAVICON_PATH
} = process.env

module.exports = {
  siteMetadata: {
    title: `Halfof8`,
    siteUrl: `https://www.yourdomain.tld`
  },
  plugins: [{
    resolve: 'gatsby-source-contentful',
    options: {
      'accessToken': CONTENTFUL_ACCESS_TOKEN,
      'spaceId': CONTENTFUL_SPACE_ID
    }
  }, 'gatsby-plugin-sass', 'gatsby-plugin-image', 'gatsby-plugin-sharp', 'gatsby-transformer-sharp', {
    resolve: 'gatsby-source-filesystem',
    options: {
      'name': 'images',
      'path': './src/images/'
    },
    __key: 'images'
  }, {
    resolve: 'gatsby-source-filesystem',
    options: {
      'name': 'pages',
      'path': './src/pages/'
    },
    __key: 'pages'
  }, {
    resolve: 'gatsby-plugin-manifest',
    options: {
      name: `gatsby-starter-default`,
      short_name: `halfof8`,
      start_url: `/`,
      display: `minimal-ui`,
      icon: FAVICON_PATH || 'src/favicon/h8-favicon.png'
    }
  }]
}

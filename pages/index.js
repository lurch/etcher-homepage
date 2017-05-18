import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';
import Layout from './_Layout';
import locals from '../locals';
import S3 from '../lib/s3';
import DownloadBtn from '../components/DownloadBtn';
import Grid from '../components/Grid';
import Feature from '../components/Feature';
import Story from '../components/Story';
import Section from '../components/Section';
import Table from '../components/Table';
import Image from '../components/Image';
import { Share } from 'react-twitter-widgets';
import includes from 'lodash/includes';
import Link from 'next/link';

const fetchData = async () => {
  try {
    const downloads = await S3(locals.s3Bucket, locals.title.toLowerCase());
    return { downloads, locals };
  } catch(err) {
    console.error(err)
    return { locals }
  }
}

export default class extends Component {

  static async getInitialProps (props) {
    return fetchData();
  }

  static async getStaticInitialProps (props) {
    return fetchData();
  }

  render () {
    const { locals, downloads } = this.props;
    return (
      <Layout locals={locals}>
        <Jumbotron className="text-center bg-inverse text-white rounded-0 mb-0">
          <h1 className="display-3">{locals.slogan}</h1>
          <p className="lead">{locals.lead}</p>
          <DownloadBtn
            className="mb-3"
            downloads={downloads}
            color="primary">
              {downloads.links[0].release.text}
          </DownloadBtn>
          <div className="text-muted">
            <p>
              or, use our <Link prefetch href="/cli"><a>experimental CLI</a></Link><br/>
              version {downloads.version} -
              <a target="_blank" href="https://resin.io/blog/etcher-1-0-is-here/"> See what&#39;s new!</a>
            </p>
          </div>
          <div className="share mb-5">
            <Share url={locals.website} />
            <div>
              <iframe src={`https://ghbtns.com/github-btn.html?user=resin-io&repo=${locals.title.toLowerCase()}&type=star&count=true`} scrolling="0" width="100" height="20px"></iframe>
            </div>
          </div>
          <div className="screenshot">
            <Image
              src={`${locals.screenshot}`}
              retina={false}
            />
          </div>
        </Jumbotron>
        <Section title="Features" className="bg-primary text-white py-5">
          <Grid className="bg-primary text-white" Component={Feature} items={locals.features} />
        </Section>
        <Section title={`Why ${locals.title}?`} className="bg-inverse text-white py-5">
          <Story story={locals.story} />
        </Section>
        <Section title="Downloads" className="py-5">
          <Table items={downloads.links} />
          <div className="text-center">
            <a href="https://github.com/resin-io/etcher#debian-and-ubuntu-based-package-repository-gnulinux-x86x64">
              Looking for Debian (.deb) packages?
            </a>
          </div>
        </Section>
      </Layout>
    );
  }
};
//import { useEffect } from "react";
import { GetStaticProps } from "next";
import { api } from "../services/api";

import Image from 'next/image';

import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDuranteTotimeString } from "../utils/convertDuranteTotimeString";

import styles from '../../styles/home.module.scss';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
};

type HomeProps = {
  latesEpisodes: Episode[];
  allEpisodes: Episode[];
};

export default function Home({latesEpisodes, allEpisodes}: HomeProps) {
  // INICIO - Chamanda para uma api usando SPA - SINGLE PAGE APPLICATION
  // useEffect(() =>{
  //   fetch('http://localhost:3333/episodes')
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  // }, []);
  // FIM - Chamanda para uma api usando SPA
  return(
    <div className={styles.homePage}>
      <section className={styles.latesEpisodes}>
        <h2>Últimos Lançamentos</h2>

        <ul>
          {latesEpisodes.map(uniqEpisode =>{
            return(
              <li key={uniqEpisode.id}>
                <Image // Componente novo para rederizar as imagens, é obrigatório os atributos (width e heiht)
                  width={192} 
                  height={192}
                  objectFit='cover' 
                  src={uniqEpisode.thumbnail} 
                  alt={uniqEpisode.title}
                />

                <div className={styles.episodesDetails}> 
                  <a href="">{uniqEpisode.title}</a>
                  <p>{uniqEpisode.members}</p>
                  <span>{uniqEpisode.publishedAt}</span>
                  <span>{uniqEpisode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar Episódio"/>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>

      </section>
    </div>
  ); 
}

// INICIO -  Chamanda para uma api usando SSR  - SERVER SIDE REDERING
// export async function getServerSideProps() {
//   const response  = await fetch("http://localhost:3333/episodes")
//   const data = await response.json();

//   return{
//     props: {
//       episodes: data,
//     }
//   }
// }
// FIM -  Chamanda para uma api usando SSR  - SERVER SIDE REDERING

// INICIO -  Chamanda para uma api usando SSG - SERVER SIDE GENERATION
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map(episode =>{
    return{
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDuranteTotimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    }
  });

  const latesEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latesEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
// FIM -  Chamanda para uma api usando SSR - SERVER SIDE GENERATION

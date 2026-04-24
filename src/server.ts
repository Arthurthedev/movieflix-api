import express from "express";
import swaggerUi from "swagger-ui-express";
import { PrismaClient } from "@prisma/client";
const port = 3000;
const app = express();
const prisma = new PrismaClient();
import swaggerDocument from "../swagger.json" with { type: "json" };
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// EXERCICIO 7
app.get("/movies/language", async (req, res) => {
  const { language } = req.query;
  const languageName = language as string;

  let where = {};
  if (languageName) {
    where = {
      languages: {
        name: {
          equals: languageName,
          mode: "insensitive",
        },
      },
    };
  }
  try {
    const movies = await prisma.movie.findMany({
      where: where,
      include: {
        genres: true,
        languages: true,
      },
    });
    if (movies.length === 0) {
      return res.status(404).json({
        message: "Nenhum filme encontrado para esse idioma",
      });
    }

    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Houve um problema ao buscar os filmes." });
  }
});
// ACABA AQUI O EX 7
app.get("/movies", async (_, res) => {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: {
        title: "asc",
      },
      include: {
        genres: true,
        languages: true,
      },
    });
    const totalMovies = movies.length;
    let totalDuration = 0;
    for (let movie of movies) {
      totalDuration += movie.duration ?? 0;
    }
    const averageDuration = totalMovies > 0 ? totalDuration / totalMovies : 0;

    res.json({
      totalMovies,
      averageDuration,
      movies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Houve um problema ao buscar os filmes." });
  }
});

app.post("/movies", async (req, res) => {
  const { title, genre_id, language_id, oscar_count, duration, release_date } =
    req.body;

  try {
    const movieWithTheSameTittle = await prisma.movie.findFirst({
      where: {
        //title: title PODEMOS OCULTAR UM "TITLE" POIS TEM O MESMO NOME
        title: { equals: title, mode: "insensitive" },
      },
    });

    if (movieWithTheSameTittle) {
      return res.status(409).send({
        message: "Já existe um filme cadastrado com esse titulo",
      });
    }
    await prisma.movie.create({
      data: {
        title,
        genre_id,
        language_id,
        oscar_count,
        duration,
        release_date: new Date(release_date),
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({ message: "Falha ao cadastrar um filme" });
  }
  res.status(201).send();
});

app.put("/movies/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const movie = await prisma.movie.findUnique({
      where: {
        id,
      },
    });
    if (!movie) {
      return res.status(404).send({ message: "Filme não encontrado" });
    }
    const data = { ...req.body };

    data.release_date = data.release_date
      ? new Date(data.release_date)
      : undefined;

    await prisma.movie.update({
      where: {
        id,
      },
      data: data,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Falha ao atualizar o registro do filme" });
  }
  res.status(200).send("Dados atualizados com sucesso");
});

app.delete("/movies/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const movie = await prisma.movie.findUnique({ where: { id } });

    if (!movie) {
      return res.status(404).send({ message: "Filme não encontrado" });
    }
    await prisma.movie.delete({ where: { id } });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Ocorreu um erro ao deletar o filme" });
  }
  return res.status(200).send("Filme deletado com sucesso!");
});

app.get("/movies/:genreName", async (req, res) => {
  try {
    const moviesFilteredByGenreName = await prisma.movie.findMany({
      include: {
        genres: true,
        languages: true,
      },
      where: {
        genres: {
          name: {
            equals: req.params.genreName,
            mode: "insensitive",
          },
        },
      },
    });
    return res.status(200).send(moviesFilteredByGenreName);
  } catch (error) {
    return res.status(500).send({ message: "Não foi possivel filtrar filmes" });
  }
});

app.listen(port, () => {
  console.log(`Servidor em execução na porta http://localhost:${port}`);
});

// EXERCICIOS DE BACKEND
// 1° ATUALIZAR UM GENERO
// app.put("/genres/:id", async (req, res) => {
//   const { id } = req.params;
//   const { name } = req.body;
//   if (!name) {
//     res
//       .status(400)
//       .send({
//         message: "O nome é um campo obrigatório ao atualizar um gênero",
//       });
//   }

//   try {
//     const genre = await prisma.genre.findUnique({
//       where: {
//         id: Number(id),
//       },
//     });
//     if (!genre) {
//      return res
//         .status(400)
//         .send({ message: "Não foi possivel encontrar esse gênero" });
//     }

//     const existingGenre = await prisma.genre.findFirst({
//       where: {
//         name: { equals: name, mode: "insensitive" },
//         id: { not: Number(id) },
//       },
//     });

//     if (existingGenre) {
//       return res
//         .status(409)
//         .send({ message: "Este nome de gênero já existe." });
//     }
//     const updateGenre = await prisma.genre.update({
//       where: {
//         id: Number(id),
//       },
//       data: {
//         name,
//       },
//     });
//     res.status(200).json(updateGenre);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "Houve um erro ao atualizar este genero" });
//   }
// });

// 2° ADICIONAR UM NOVO GENERO

// app.post("/genres", async (req, res) => {
//   const { name } = req.body;

//  // 1. Verifica se existe
//   if (!name) {
//     return res
//       .status(400)
//       .send({ message: "O nome é obrigatório ao criar um gênero" });
//   }

//   // 2. Verifica se é string
//   if (typeof name !== "string") {
//     return res
//       .status(400)
//       .send({ message: "O nome deve ser um texto válido" });
//   }

//   const normalizedName = name.trim();

//   // 3. Verifica se não ficou vazio depois do trim
//   if (!normalizedName) {
//     return res
//       .status(400)
//       .send({ message: "O nome não pode ser vazio" });
//   }

//   // 4. Verifica se é apenas número
//   if (!isNaN(Number(normalizedName))) {
//     return res
//       .status(400)
//       .send({ message: "O nome do gênero não pode ser apenas números" });
//   }
//   try {
//     const existingGenre = await prisma.genre.findFirst({
//       where: {
//         name: { equals: name, mode: "insensitive" },
//       },
//     });
//     if (existingGenre) {
//       return res.status(409).send({ message: "Esse gênero já existe" });
//     }
//     const newGenre = await prisma.genre.create({
//       data: {
//         name,
//       },
//     });
//     res.status(201).json(newGenre);
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .send({ message: "Não foi possivel criar este novo gênero" });
//   }
// });

// 3° BUSCAR GENEROS
// app.get("/genres", async (_, res) => {
//     try {
//         const genres = await prisma.genre.findMany({
//             orderBy: {
//                 name: "asc",
//             },
//         });

//         res.json(genres);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: "Houve um problema ao buscar os gêneros." });
//     }
// });

// 4° DELETAR GENERO
// app.delete("/genres/:id", async (req, res) => {
//     const { id } = req.params;

//     try {
//         const genre = await prisma.genre.findUnique({
//             where: { id: Number(id) },
//         });

//         if (!genre) {
//             return res.status(404).send({ message: "Gênero não encontrado." });
//         }

//         await prisma.genre.delete({
//             where: { id: Number(id) },
//         });

//         res.status(200).send({ message: "Gênero removido com sucesso." });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: "Houve um problema ao remover o gênero." });
//     }
// });

// O EX 5 FOI MODIFICAR O MODEL MOVIES E MUDAR ALGUMAS COISAS NA ROTA DE GET (PRIMEIRA ROTA DO SERVER.TS)

// 6° Modificando o endpoint de listagem de filmes para permitir ordenação por diversos critérios

// app.get("/movies/sort", async (req, res) => {
//   const { sort } = req.query;
//   console.log(sort);
//   let orderBy:
//     | Prisma.MovieOrderByWithRelationInput
//     | Prisma.MovieOrderByWithRelationInput[]
//     | undefined;
//   if (sort === "title") {
//     orderBy = {
//       title: "asc",
//     };
//   } else if (sort === "release_date") {
//     orderBy = {
//       release_date: "asc",
//     };
//   }

//   try {
//     const movies = await prisma.movie.findMany({
//       ...(orderBy && { orderBy }),
//       include: {
//         genres: true,
//         languages: true,
//       },
//     });

//     res.json(movies);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: "Houve um problema ao buscar os filmes." });
//   }
// });

// 7° Criando um filtro de language para o endpoint de listagem de filmes
// O EXERCICIO 7 TA NO TOPO DO SERVE.TS POR CONTA DE UM ERRO DE CONFLITO NA ORDEM QUE AS COISAS SAO LIDAS NO EXPRESS

// 8° OS EXERCICIOS 6 E 7 EM UM UNICO CODIGO

/*
Este endpoint permite que os usuários filtrem filmes por idioma e ordenem os resultados 
por título ou data de lançamento. Se nenhum desses parâmetros for fornecido, o endpoint 
retornará todos os filmes sem qualquer ordenação específica.
*/

app.get("/movies/filter", async (req, res) => {
  const { language, sort } = req.query;
  const languageName = language as string;
  const sortName = sort as string;

  let orderBy = {};
  if (sortName === "title") {
    orderBy = {
      title: "asc",
    };
  } else if (sortName === "release_date") {
    orderBy = {
      release_date: "asc",
    };
  }

  let where = {};
  if (languageName) {
    where = {
      languages: {
        name: {
          equals: languageName,
          mode: "insensitive",
        },
      },
    };
  }

  try {
    const movies = await prisma.movie.findMany({
      orderBy,
      where: where,
      include: {
        genres: true,
        languages: true,
      },
    });
    if (movies.length === 0) {
      return res.status(404).json({
        message: "Nenhum filme encontrado para esse idioma",
      });
    }

    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Houve um problema ao buscar os filmes." });
  }
});

let leaders = []

async function showLeaders() {
    leaders = await fetchLeaderboard()
    console.log(leaders)
    let top1 = leaders[0].user
    let top2 = leaders[1].user
    let top3 = leaders[2].user
    let top4 = leaders[3].user
    let top5 = leaders[4].user

    let top1puntos = leaders[0].puntaje
    let top2puntos = leaders[1].puntaje
    let top3puntos = leaders[2].puntaje
    let top4puntos = leaders[3].puntaje
    let top5puntos = leaders[4].puntaje

    console.log('hola')
    console.log(top1)

    document.body.innerHTML += `<p style="margin-top: 10vh; margin-left: 10vw; font-size: 40px;">Este es el top 5 actual de jugadores con mas puntos :</p>`
    document.body.innerHTML += `<center><p style="margin-top: 8vh; font-size: 40px;">🥇 ${top1}, con ${top1puntos} puntos</p></center>`
    document.body.innerHTML += `<center><p style="margin-top: 3vh; font-size: 40px;">🥈 ${top2}, con ${top2puntos} puntos</p></center>`
    document.body.innerHTML += `<center><p style="margin-top: 3vh; font-size: 40px;">🥉 ${top3}, con ${top3puntos} puntos</p></center>`
    document.body.innerHTML += `<center><p style="margin-top: 6vh; font-size: 35px;">${top4}, con ${top4puntos} puntos</p></center>`
    document.body.innerHTML += `<center><p style="margin-top: 2vh;font-size: 35px;">${top5}, con ${top5puntos} puntos</p></center>`
    
}

function inicio() {
    showLeaders()
}

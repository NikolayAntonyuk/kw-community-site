// Завантаження даних каталогу спеціалістів з локального JSON файлу.

export async function fetchSpecialists({ force = false } = {}) {
  const response = await fetch("data/specialists.json");
  if (!response.ok) {
    throw new Error(`Не вдалося завантажити дані каталогу (HTTP ${response.status}).`);
  }
  const specialists = await response.json();
  return specialists;
}

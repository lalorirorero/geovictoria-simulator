// ─── BASE DE CONOCIMIENTO GEOVICTORIA (con país) ─────────────────
// 80 chunks. Generado desde geovictoria_knowledge_base.jsonl + país inyectado.
// País por chunk:
//   - casos (cita/roi/dolor concreto): pais = "Chile" | "Colombia" | "Perú" | "México" (del texto del chunk)
//   - objeciones: pais = "multipais" + pais_distribution (Excel objeciones corregido vía Zoho)
//   - transversales (solucion/metodologia/buyer_persona/...): pais = "all"
// Campos: { id, category, industry, subcategory, tags[], title, content, pais, pais_fuente, [pais_distribution, pais_n] }

export const KB = [
  {
    "id": "GV-BUYER-PERSONA-001",
    "category": "buyer_persona",
    "industry": "retail",
    "subcategory": "coo",
    "tags": [
      "director_operaciones",
      "coo",
      "retail",
      "kpi",
      "dolor",
      "buyer_persona"
    ],
    "title": "Buyer Persona Retail — Director de Operaciones (COO)",
    "content": "Perfil: Director de Operaciones en retail. Gestiona 50+ puntos de venta o zonas. Vive en el caos operacional. KPIs que le importan: eficiencia operativa, cumplimiento de turnos, costo laboral % vs. venta. Dolores profundos: (1) Ceguera situacional — 'No sé si la tienda 45 abrió a tiempo hasta que un cliente se queja. Gestiono por retrovisor con WhatsApp y Excel.' (2) Fuga de horas (robo hormiga) — 'Mis gerentes de tienda maquillan los horarios o se cubren entre amigos (buddy punching).' (3) Cobertura de personal — 'Pierdo ventas porque me falta gente en horas pico y me sobra en horas valle, y no tengo datos para optimizarlo.' Propuesta de valor para él: control en tiempo real, validación biométrica, optimización de malla.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-BUYER-PERSONA-002",
    "category": "buyer_persona",
    "industry": "retail",
    "subcategory": "cfo",
    "tags": [
      "cfo",
      "director_financiero",
      "retail",
      "ebitda",
      "roi",
      "buyer_persona"
    ],
    "title": "Buyer Persona Retail — Director Financiero (CFO)",
    "content": "Perfil: Director Financiero en retail. No le importa la app — le importa el margen. KPIs: EBITDA/margen neto, reducción de OpEx, riesgo legal. Dolores: (1) Hemorragia de horas extras — 'Pago un 15-20% de sobrecosto en nómina variable y no sé si es justificado o ineficiencia.' (2) Riesgo de demandas — 'No tengo trazabilidad digital irrefutable ante una demanda laboral por horas no pagadas o descuentos indebidos.' (3) Costo de procesamiento — 'Mi equipo pierde días conciliando datos manuales, retrasando el cierre contable.' Propuesta de valor: 'Nuestros clientes reducen su nómina variable un 8-12% el primer año eliminando pagos indebidos. Eso paga el software 10 veces.' y 'Cada registro es una prueba digital con fecha, hora y ubicación exacta, lista para cualquier auditoría.'",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-BUYER-PERSONA-003",
    "category": "buyer_persona",
    "industry": "retail",
    "subcategory": "rrhh",
    "tags": [
      "gerente_rrhh",
      "talento",
      "nomina",
      "buyer_persona",
      "retail",
      "usuario_diario"
    ],
    "title": "Buyer Persona Retail — Gerente de RRHH / Talento (usuario diario)",
    "content": "Perfil: Gerente de RRHH en retail. Está ahogado en burocracia. Es el usuario diario del sistema. KPIs: precisión de nómina, ausentismo, clima laboral. Dolores: (1) Infierno administrativo — 'El cierre de quincena es una pesadilla de 3 días corrigiendo incidencias y peleando con operaciones.' (2) Gestión de novedades — 'Me entero de las incapacidades o vacaciones cuando ya pasaron, descuadrando la nómina.' (3) Fricción con empleados — 'Los empleados se quejan de que les pagamos mal sus horas extra porque el supervisor reportó mal en el Excel.' Propuesta de valor: 'Transformamos el cierre de 3 días en un proceso de 2 horas integrando incidencias directo al software de nómina.' y 'El empleado ve sus horas trabajadas en su app. Eliminamos la desconfianza y las quejas de pago.'",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-CITA-001",
    "category": "cita",
    "industry": "retail",
    "subcategory": "planificacion",
    "tags": [
      "cita",
      "testimonial",
      "retail",
      "planificacion"
    ],
    "title": "Cita — 'No somos pitonizos' (DI-005)",
    "content": "Cita textual de cliente GeoVictoria, analista de personas en empresa retail automotriz Chile (DI-005, >500 col): 'No somos pitonizos, tendríamos que ser Mandrake el Mago para poder decir, ah sí, Juan sí vino.' Contexto: hablando de la imposibilidad de gestionar la asistencia sin visibilidad en tiempo real, con cruces manuales entre GeoVictoria y Book usando tablas dinámicas. Uso comercial: ideal para abrir conversaciones sobre la necesidad de integración con nómina o para ilustrar el dolor de gestión manual de asistencia en retail.",
    "pais": "Chile",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-CITA-002",
    "category": "cita",
    "industry": "retail",
    "subcategory": "horas_extra",
    "tags": [
      "cita",
      "testimonial",
      "kfc",
      "colombia",
      "horas_extra",
      "roi"
    ],
    "title": "Cita — '100.000 dólares... hoy pagamos 20k' (DI-027)",
    "content": "Cita textual de cliente GeoVictoria, cadena de restaurantes KFC Colombia (DI-027, 4.912 colaboradores): 'En un mes pagábamos unos 100.000 dólares en horas extras. Después de la implementación bajamos a 80k, luego 40k, y hoy en día pagamos 20k dólares.' Contexto: hablando del impacto de controlar las horas extra con trazabilidad real. Uso comercial: el caso de ROI más poderoso de la base de datos para retail/restaurantes. Usar con CFOs y decisores financieros para mostrar ROI medible y creíble.",
    "pais": "Colombia",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-CITA-003",
    "category": "cita",
    "industry": "outsourcing",
    "subcategory": "inconsistencias",
    "tags": [
      "cita",
      "testimonial",
      "outsourcing",
      "inconsistencias",
      "nomina"
    ],
    "title": "Cita — '3.500 inconsistencias... 15 con suerte' (DI-028)",
    "content": "Cita textual de cliente GeoVictoria, outsourcing de aseo industrial Chile (DI-028, 1.500 trabajadores): 'Atacar 3.500 inconsistencias era imposible llegar en los plazos para los pagos... cambiamos a 15 con suerte.' Contexto: hablando del impacto de GeoVictoria en la calidad del proceso de cierre de nómina. La usuaria lleva 13 años con GeoVictoria en dos empresas distintas. Uso comercial: ideal para mostrar el impacto en calidad de datos y eficiencia operativa en cualquier industria con muchos colaboradores.",
    "pais": "Chile",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-CITA-004",
    "category": "cita",
    "industry": "plantas_productivas",
    "subcategory": "nomina",
    "tags": [
      "cita",
      "testimonial",
      "mexico",
      "planta",
      "nomina",
      "eficiencia"
    ],
    "title": "Cita — 'De 3 días a 10 horas hombre' (DI-006)",
    "content": "Cita textual de cliente GeoVictoria, planta industrial México (DI-006, Grupo ECOM/ICO, jornadas 12h): 'De una inversión de 3 días a una inversión de quizás ahora de 10 horas hombre.' Contexto: hablando de la reducción del tiempo de cierre de nómina tras implementar GeoVictoria y configurar las reglas del convenio. Este cliente recomendó GeoVictoria al corporativo. Uso comercial: ideal para plantas productivas, manufactura y cualquier cliente donde el proceso de nómina sea complejo por reglas de convenio.",
    "pais": "México",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-CITA-005",
    "category": "cita",
    "industry": "construccion",
    "subcategory": "libro",
    "tags": [
      "cita",
      "testimonial",
      "construccion",
      "libro",
      "trazabilidad"
    ],
    "title": "Cita — 'La huella es un elemento verídico, el libro no' (DI-039)",
    "content": "Cita textual de cliente GeoVictoria, constructora Chile (DI-039, ~88 col, obras de 2-3 meses): 'La huella es un elemento verídico, el libro no.' Contexto: hablando de la diferencia entre el libro de asistencia físico (manipulable, sin valor probatorio) y el marcaje biométrico de GeoVictoria. Llegó a GeoVictoria por recomendación de otra empresa que ya lo usaba. Uso comercial: para abrir conversaciones en construcción sobre el riesgo del libro de asistencia ante fiscalizaciones y juicios laborales.",
    "pais": "Chile",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-CITA-006",
    "category": "cita",
    "industry": "outsourcing",
    "subcategory": "relacion",
    "tags": [
      "cita",
      "testimonial",
      "colombia",
      "outsourcing",
      "cam",
      "relacion"
    ],
    "title": "Cita — 'Si no estuviera Miguel, hubiera abortado la misión' (DI-012)",
    "content": "Cita textual de cliente GeoVictoria, outsourcing Colombia (DI-012, 7.000 col, 600 clientes): 'Si no estuviera Miguel, yo hace rato hubiera abortado la misión con ustedes.' Contexto: hablando de la importancia del CAM (Customer Account Manager) como el principal generador de valor percibido. El CAM fue identificado como el factor más determinante para la retención de este cliente. Uso comercial: ilustra que en outsourcing la relación con el KAM/CAM puede ser más importante para la retención que el producto en sí.",
    "pais": "Colombia",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-CITA-007",
    "category": "cita",
    "industry": "plantas_productivas",
    "subcategory": "multas_dt",
    "tags": [
      "cita",
      "testimonial",
      "mineria",
      "chile",
      "multa_dt",
      "60_utm"
    ],
    "title": "Cita — 'La DT nos multó en Chuquicamata' (DI-024)",
    "content": "Cita textual de cliente GeoVictoria, empresa de ingeniería/minería Chile (DI-024, 2.200 col, 60 centros de costo): 'La DT nos multó en Chuquicamata porque una persona marcaba a las 7:55 y su turno era a las 8... cuatro multas de hasta 60 UTM cada una.' Contexto: hablando del riesgo de multas masivas por marcas fuera de rango cuando hay cientos de trabajadores y múltiples turnos. El riesgo máximo calculado es de 16 millones de pesos CLP por una sola marca. Uso comercial: para plantas y empresas mineras chilenas donde el riesgo de multa DT es real y cuantificable.",
    "pais": "Chile",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-DOLOR-CONST-001",
    "category": "dolor",
    "industry": "construccion",
    "subcategory": "externos_subcontratistas",
    "tags": [
      "subcontratistas",
      "externos",
      "documentacion",
      "seguridad",
      "evacuacion"
    ],
    "title": "Construcción — Dolor: Alta proporción de personal externo y subcontratistas",
    "content": "En obras de construcción, entre 2/3 y 3/4 del personal pertenece a empresas contratistas externas. Los dolores específicos son: no saber la dotación real del personal por empresa y por cargo, no confiar en que los contratistas cumplan el contrato de dotación y horas, no poder identificar quién está dentro de la obra para una evacuación en caso de siniestro, y el área administrativa pierde horas diarias procesando y consolidando la asistencia de externos manualmente. Este es el dolor de mayor intensidad en construcción (5/5).",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-CONST-002",
    "category": "dolor",
    "industry": "construccion",
    "subcategory": "libro",
    "tags": [
      "libro",
      "fraude",
      "manipulacion",
      "atrasos",
      "capataz"
    ],
    "title": "Construcción — Dolor: Libro de asistencia manual y manipulable",
    "content": "El libro físico es el método dominante en obras de construcción. Sus problemas: el capataz firma el libro mostrando hora exacta aunque el trabajador llegó tarde, no registra atrasos reales, puede ser firmado por otro trabajador (fraude), y no tiene trazabilidad ni valor probatorio real ante la DT. Cita real DI-039: 'La huella es un elemento verídico, el libro no.' Caso real DI-022: detectaron que el mismo celular de obra se compartía para marcar con la misma foto, sin que el sistema lo detectara. Intensidad: 4/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-CONST-003",
    "category": "dolor",
    "industry": "construccion",
    "subcategory": "documental",
    "tags": [
      "documentacion",
      "induccion",
      "examen_ocupacional",
      "prevision",
      "seguridad_laboral"
    ],
    "title": "Construcción — Dolor: Gestión documental inexistente",
    "content": "En obras entra personal sin inducción completada, sin exámenes ocupacionales al día, o con la parte previsional sin resolver. No hay ningún sistema que bloquee el ingreso de quien no cumple los requisitos documentales. Los riesgos son: accidente laboral con persona no habilitada, multas de la inspección del trabajo, demandas laborales, y suspensión de la obra. La gestión documental manual consume horas del área administrativa y aún así tiene brechas. Intensidad: 4/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-CONST-004",
    "category": "dolor",
    "industry": "construccion",
    "subcategory": "marcaje_tecnico",
    "tags": [
      "marcaje",
      "conectividad",
      "celular",
      "infraestructura",
      "app_cuadrilla"
    ],
    "title": "Construcción — Dolor: Marcaje en obra técnicamente difícil",
    "content": "Las obras de construcción presentan desafíos únicos para el marcaje: sin conectividad de red estable, sin posibilidad de instalar infraestructura permanente (la obra se mueve), personal que no quiere usar su celular personal, y supervisores que terminan marcando por todos. El fraude más común detectado: un solo celular de obra compartido para que todos marquen, con la misma foto o ubicación. Intensidad: 3/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-CONST-005",
    "category": "dolor",
    "industry": "construccion",
    "subcategory": "visibilidad_gerencial",
    "tags": [
      "gerencia",
      "monitoreo",
      "dotacion",
      "cuellos_botella",
      "atraso_obra"
    ],
    "title": "Construcción — Dolor: Sin visibilidad centralizada de dotación",
    "content": "A nivel gerencial en construcción, el dolor principal es que la obra se atrasa. Para evitarlo necesitan monitoreo centralizado de dotación, cuellos de botella y cumplimiento por empresa contratista. La gestión actual es reactiva: se enteran del problema cuando ya ocurrió. Un cuello de botella en dotación puede atrasar toda la obra y generar penalidades contractuales. Intensidad: 3/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-CONST-006",
    "category": "dolor",
    "industry": "construccion",
    "subcategory": "estructura_grupos",
    "tags": [
      "grupos",
      "cuadrillas",
      "capataz",
      "jerarquia",
      "reportes"
    ],
    "title": "Construcción — Dolor: Estructura de grupos no refleja la obra",
    "content": "Una obra tiene múltiples cuadrillas, cada una con su capataz. La jerarquía real es: obra → cuadrilla → trabajador. GeoVictoria actualmente solo permite un nivel de agrupación, impidiendo estructurar esa jerarquía. El cliente termina trabajando con una estructura que no refleja su operación real, generando reportes que no sirven para gestión. Cita real DI-039: 'No sé si existe la posibilidad de tener otro centro de costo para separar obras y mantener mi estructura de grupos por capataz.' Intensidad: 2/5 (pero muy específico de construcción).",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-OUT-001",
    "category": "dolor",
    "industry": "outsourcing",
    "subcategory": "cumplimiento_mandante",
    "tags": [
      "mandante",
      "cumplimiento",
      "facturacion",
      "contrato",
      "evidencia"
    ],
    "title": "Outsourcing — Dolor: Demostrar cumplimiento al mandante",
    "content": "El dolor central del outsourcing: el negocio no controla las instalaciones donde trabaja su gente. El ingreso económico entero depende de poder probar que el personal llegó, cumplió las horas pactadas y ejecutó las tareas acordadas. Sin ese respaldo, el cobro de la factura queda en disputa. El outsourcing necesita demostrar cumplimiento de horarios (Horas Trabajadas, Horas No Trabajadas y HH.EE.) al mandante para habilitar el pago posterior de los servicios. El mandante puede tener acceso al reporte para verificar en tiempo real. Intensidad: 5/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-OUT-002",
    "category": "dolor",
    "industry": "outsourcing",
    "subcategory": "asignacion",
    "tags": [
      "calendario",
      "asignacion",
      "slots",
      "contrato_cliente",
      "ley_laboral"
    ],
    "title": "Outsourcing — Dolor: Asignación de personas según contrato del cliente",
    "content": "El outsourcing debe asignar personas a los espacios de tiempo que debe cumplir con cada mandante (cliente final), respetando simultáneamente: la ley laboral local, la jornada del trabajador individual, las restricciones del contrato con el cliente, y las restricciones de la industria. Hoy esto se hace en Excel con alto riesgo de error. El calendario de GeoVictoria para outsourcing asigna el tiempo a la gente (no la gente al turno), sujeto a todas las restricciones anteriores. Intensidad: 5/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-OUT-003",
    "category": "dolor",
    "industry": "outsourcing",
    "subcategory": "terreno",
    "tags": [
      "terreno",
      "atrasos",
      "ausentismo",
      "faltas",
      "tiempo_real"
    ],
    "title": "Outsourcing — Dolor: Sin control de la gente en terreno",
    "content": "Como no son instalaciones propias, el outsourcing no tiene visibilidad de qué pasa en el punto de servicio. Las faltas se detectan días después, cuando ya hay incumplimiento ante el mandante. Cita real DI-014 (outsourcing limpieza bancaria, México): 'No controlábamos el nivel de faltas, no sabíamos que había faltado el personal hasta días después.' Esto genera: incumplimiento de contrato con el cliente, riesgo de penalización, y reputación dañada. Intensidad: 4/5.",
    "pais": "México",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-DOLOR-OUT-004",
    "category": "dolor",
    "industry": "outsourcing",
    "subcategory": "reporteria",
    "tags": [
      "reportes",
      "liquidacion",
      "nomina",
      "facturacion",
      "excel",
      "cruce"
    ],
    "title": "Outsourcing — Dolor: Reportería cruzada para facturar y liquidar",
    "content": "El modelo de negocio del outsourcing exige distribuir costos por cliente, servicio y grupo. GeoVictoria entrega reportes estándar que hay que cruzar manualmente en Excel para llegar a ese desglose. En empresas grandes esto implica cruzar 4+ reportes con macros propias. Caso real DI-012 (outsourcing Colombia, 7.000 col, 1.300 grupos, 600 clientes): reporte sin ID de grupo (solo nombre) obliga cruce adicional obligatorio, máximo 4 marcas visibles por persona por día insuficiente. Resultado de mejora: ~0,3% reducción en costos de liquidación — sobre volumen masivo, es significativo. Intensidad: 4/5.",
    "pais": "Colombia",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-DOLOR-OUT-005",
    "category": "dolor",
    "industry": "outsourcing",
    "subcategory": "tareo",
    "tags": [
      "tareo",
      "fraude",
      "supervisor",
      "excel",
      "manipulacion"
    ],
    "title": "Outsourcing — Dolor: Tareo manual con supervisores como juez y parte",
    "content": "Antes de GeoVictoria, el tareo lo hacían supervisores en planillas Excel sin trazabilidad ni posibilidad de auditoría. Los supervisores marcaban lo que convenía, ponían asistencia sin que la persona viniera, y nadie podía verificarlo. Cita real: 'No había un control de una sola unidad — cada CEDIS hacía su propio control, muchas personas no asisten pero se los ponen ahí como buenos.' (DI-043) Este fraude genera nómina pagada en exceso y exposición a demandas laborales. Intensidad: 3/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-OUT-006",
    "category": "dolor",
    "industry": "outsourcing",
    "subcategory": "workflow_hhee",
    "tags": [
      "horas_extra",
      "workflow",
      "aprobacion",
      "correo",
      "registro"
    ],
    "title": "Outsourcing — Dolor: Aprobación de HH.EE. fuera del sistema",
    "content": "Las horas extraordinarias en outsourcing se aprueban por correo, WhatsApp o en papel. No hay registro dentro del sistema, lo que genera disputas con el trabajador ('yo sí trabajé esas horas') y dificulta demostrar al mandante lo que se factura. Caso real DI-044 (Sodexo Perú, 6.000 col): 'Enviamos correos para aprobación de HE fuera del sistema; llevamos registro manual por correo.' Esto hace imposible auditar ni para el cliente ni para el trabajador. Intensidad: 3/5.",
    "pais": "Perú",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-DOLOR-OUT-007",
    "category": "dolor",
    "industry": "outsourcing",
    "subcategory": "dispersion",
    "tags": [
      "dispersion",
      "escala",
      "municipios",
      "puntos_trabajo",
      "masivo"
    ],
    "title": "Outsourcing — Dolor: Alta dispersión geográfica",
    "content": "El outsourcing opera en cientos o miles de puntos dispersos sin infraestructura propia. El más grande de la base de clientes Data Invaders tiene 25.000 activos en 395 municipios y 3.800 puntos de trabajo (DI-047, Colombia). Sin un sistema centralizado que funcione sin infraestructura del cliente, el control es imposible. El crecimiento del negocio está directamente limitado por la capacidad de controlar puntos dispersos. Intensidad: 3/5.",
    "pais": "Colombia",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-DOLOR-OUT-008",
    "category": "dolor",
    "industry": "outsourcing",
    "subcategory": "ingreso_usuarios",
    "tags": [
      "ingreso",
      "fecha_contrato",
      "faltas",
      "bug",
      "nomina"
    ],
    "title": "Outsourcing — Dolor: Nuevos ingresos con faltas desde antes del contrato",
    "content": "Al ingresar a una persona en GeoVictoria con una fecha de contrato, el sistema puede mostrar faltas en días previos a esa fecha, generando confusión en el tareo y errores en el pago. Cita real DI-044 (Sodexo Perú): 'Una persona ingresó el 14, pero estaba jalando faltas desde días anteriores... genera confusión en el análisis del tareo para el cierre de pago.' Este mismo bug fue reportado por clientes en Chile, Colombia y Perú. Intensidad: 4/5 (para empresas con alta rotación).",
    "pais": "Perú",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-DOLOR-PLANTA-001",
    "category": "dolor",
    "industry": "plantas_productivas",
    "subcategory": "turnos_247",
    "tags": [
      "24/7",
      "turnos_rotativos",
      "amanecida",
      "nómina",
      "lógica_turnos"
    ],
    "title": "Plantas Productivas — Dolor: Operación 24/7 con múltiples turnos",
    "content": "Las plantas industriales operan con turnos de día, tarde, noche y amanecida que cruzan dos días calendario. Los sistemas que no entienden esta lógica generan errores sistemáticos: el turno de amanecida que empieza a las 22:00 y termina a las 06:00 del día siguiente se lee incorrectamente, generando ~800 correcciones manuales por mes en plantas medianas. Cita real DI-038 (manufactura Perú, 800 col): 'El turno de amanecida, que agarra dos días, la plataforma no lee este turno de manera correcta... eso nos está demandando demasiada operatividad.' Intensidad: 5/5.",
    "pais": "Perú",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-DOLOR-PLANTA-002",
    "category": "dolor",
    "industry": "plantas_productivas",
    "subcategory": "convenio_colectivo",
    "tags": [
      "convenio",
      "sindicato",
      "hhee_dobles",
      "hhee_triples",
      "prima_dominical",
      "bonificacion",
      "nómina"
    ],
    "title": "Plantas Productivas — Dolor: Reglas de negocio del convenio colectivo",
    "content": "Los convenios colectivos en plantas industriales son de los más complejos del mercado: HH.EE. dobles y triples con criterios de corte propios de la empresa, descansos elaborados, bono de turno nocturno (35% adicional desde las 22:00 en Perú), prima dominical, bonificaciones por zona productiva. Las reglas cambian con cada negociación colectiva. Calcular esto manualmente implica descargar 3+ reportes de GeoVictoria y cruzarlos con fórmulas Excel propias. Caso real DI-006 (planta México): reducción de 3 días de trabajo a 10 horas-hombre para cerrar nómina. Intensidad: 5/5.",
    "pais": "Perú",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-DOLOR-PLANTA-003",
    "category": "dolor",
    "industry": "plantas_productivas",
    "subcategory": "control_acceso",
    "tags": [
      "control_acceso",
      "zonas",
      "seguridad",
      "turno",
      "habilitacion",
      "bonificacion"
    ],
    "title": "Plantas Productivas — Dolor: Control de acceso vinculado a planificación",
    "content": "En plantas industriales el control de acceso tiene dos usos críticos: (1) Seguridad — verificar que quien entra a una zona de riesgo tiene el turno planificado y el nivel de acceso habilitado para esa zona. Personas en zonas de alta peligrosidad sin habilitación = riesgo de accidente grave. (2) Bonificación — el tiempo en zonas productivas específicas es la base para el cálculo de ciertos bonos. Si el control de acceso falla, el cálculo de bonificación falla. Intensidad: 4/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-PLANTA-004",
    "category": "dolor",
    "industry": "plantas_productivas",
    "subcategory": "comedor",
    "tags": [
      "comedor",
      "sodexo",
      "aramark",
      "proveedor",
      "colaciones",
      "cobro"
    ],
    "title": "Plantas Productivas — Dolor: Comedor sin control de cobro",
    "content": "Las plantas están en zonas alejadas sin servicios externos de alimentación. El proveedor de colaciones (Sodexo, Aramark, Hendaya) cobra por las colaciones que dice haber servido. Sin un sistema de control, la planta no puede verificar si lo cobrado coincide con lo realmente servido. El riesgo es el sobrecobro sistemático del proveedor sin evidencia para rebatirlo. La solución es condicionar el acceso al comedor a la presencia verificada: si no tiene marca de asistencia ese día, no puede comer. Intensidad: 4/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-PLANTA-005",
    "category": "dolor",
    "industry": "plantas_productivas",
    "subcategory": "planificacion",
    "tags": [
      "planificacion",
      "horas_contractuales",
      "calendario",
      "supervisor",
      "visibilidad"
    ],
    "title": "Plantas Productivas — Dolor: Supervisores sin visibilidad de planificación incorrecta",
    "content": "Los supervisores en plantas no tienen forma de verificar en tiempo real si las planificaciones cumplen las horas contractuales. El error típico: una persona que debe trabajar 44 horas tiene 38 horas planificadas y nadie lo detecta hasta el cierre de nómina. Consecuencia: incumplimiento del contrato de trabajo, riesgo de demanda laboral, y pago de diferencias al liquidar. En plantas con cientos de trabajadores con contratos distintos, este error es sistemático. Intensidad: 3/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-PLANTA-006",
    "category": "dolor",
    "industry": "plantas_productivas",
    "subcategory": "multas_dt",
    "tags": [
      "multa_dt",
      "marcas_fuera_rango",
      "utm",
      "chuquicamata",
      "corrección_masiva"
    ],
    "title": "Plantas Productivas — Dolor: Marcas fuera de turno generan multas masivas",
    "content": "En plantas con múltiples turnos diarios y cientos de trabajadores, las marcas fuera de rango son frecuentes: alguien marca 5 minutos antes del inicio de turno. Cada marca fuera de rango puede generar una infracción ante la Dirección del Trabajo de hasta 60 UTM por persona. Corregirlas una a una es inviable. Cita real DI-024 (minería Chile, 2.200 col): 'La DT nos multó en Chuquicamata porque una persona marcaba a las 7:55 y su turno era a las 8 — cuatro multas de hasta 60 UTM cada una.' Riesgo máximo: hasta 16 millones de pesos CLP por una sola marca. Intensidad: 4/5.",
    "pais": "Chile",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-DOLOR-PLANTA-007",
    "category": "dolor",
    "industry": "plantas_productivas",
    "subcategory": "hardware",
    "tags": [
      "hardware",
      "reloj",
      "falla",
      "24/7",
      "soporte_nocturno",
      "arriendo"
    ],
    "title": "Plantas Productivas — Dolor: Fiabilidad del hardware en operación continua",
    "content": "Una planta que opera 24/7 no puede quedarse sin marcaje. Si el reloj falla a las 3 AM no hay soporte disponible en un servicio estándar de L-V. Un reloj dañado en turno nocturno puede dejar sin registro de asistencia a cientos de trabajadores, generando inconsistencias masivas en nómina. Los clientes de plantas exigen: hardware resistente a condiciones industriales, arriendo con mantenimiento y SLA de reposición ante falla, y soporte extendido 24/7. El soporte 24/7 aparece explícitamente como criterio de evaluación en múltiples entrevistas. Intensidad: 3/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-PLANTA-008",
    "category": "dolor",
    "industry": "plantas_productivas",
    "subcategory": "uniformes",
    "tags": [
      "uniformes",
      "epp",
      "equipamiento",
      "seguridad",
      "registro"
    ],
    "title": "Plantas Productivas — Dolor: Control de uniformes y EPP",
    "content": "Las plantas deben asignar y controlar equipamiento de protección personal (EPP) y uniformes por trabajador. Sin sistema, no saben quién tiene qué equipamiento, cuándo se entregó ni cuándo vence. El riesgo es tener personal en zona productiva sin EPP al día, lo que es una infracción de seguridad laboral. La solución de GeoVictoria usa la misma lógica del módulo comedor: registrar la entrega y vencimiento de equipamiento por trabajador. Intensidad: 2/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-RETAIL-001",
    "category": "dolor",
    "industry": "retail",
    "subcategory": "planificacion",
    "tags": [
      "turnos",
      "planificacion",
      "excel",
      "horas_extra",
      "calendario"
    ],
    "title": "Retail — Dolor: Planificación de turnos ineficiente",
    "content": "Los supervisores de retail gastan muchas horas armando mallas de turnos en Excel sin visibilidad de si las planificaciones están bien asignadas. Los problemas principales son: no hay control de restricciones legales (domingos libres, horas semanales máximas, límite de 7 días continuos), se generan sobredotación y subdotación sin detectarlo, y se planifican menos horas de las contractuales (ej: persona que debe trabajar 44 horas tiene 38 planificadas). La consecuencia directa es pérdida de venta o pago excesivo de horas extra. Este es el dolor de mayor intensidad en retail (5/5).",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-RETAIL-002",
    "category": "dolor",
    "industry": "retail",
    "subcategory": "horas_extra",
    "tags": [
      "horas_extra",
      "fraude",
      "nómina",
      "excel",
      "aprobacion"
    ],
    "title": "Retail — Dolor: Horas extra fuera de control",
    "content": "Las horas extraordinarias en retail se aprueban por correo, WhatsApp o Excel sin trazabilidad. Los supervisores actúan como 'juez y parte' reportando lo que conviene. Se pagan horas sin respaldo verificable de marcaje. En el caso real de KFC Colombia (4.912 colaboradores), las HH.EE. pasaron de USD 100.000/mes a USD 20.000/mes tras implementar GeoVictoria — un ahorro de USD 80.000 mensuales. Intensidad: 5/5.",
    "pais": "Colombia",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-DOLOR-RETAIL-003",
    "category": "dolor",
    "industry": "retail",
    "subcategory": "apertura_tiendas",
    "tags": [
      "apertura",
      "tienda",
      "cargo_critico",
      "mall",
      "multa",
      "venta"
    ],
    "title": "Retail — Dolor: Sin visibilidad de apertura de tiendas",
    "content": "El retail no sabe si una sucursal está abierta o si el cargo crítico (tesorero, guardia, jefe de tienda, punto de venta) llegó a tiempo. La información llega por WhatsApp cuando el mall o un cliente ya se quejó. Los riesgos son: multas por incumplimiento del contrato de arriendo del mall (UF 3-5 por evento), pérdida de venta en hora pico (~CLP 180.000-350.000 por tienda) y deterioro de la relación con el mall. En redes medianas se reportan 6-8 eventos de apertura tardía al mes. Intensidad: 4/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-RETAIL-004",
    "category": "dolor",
    "industry": "retail",
    "subcategory": "nomina",
    "tags": [
      "nomina",
      "cierre",
      "excel",
      "tablas_dinamicas",
      "book",
      "integracion"
    ],
    "title": "Retail — Dolor: Cierre de nómina manual (3 días por quincena)",
    "content": "El proceso de cierre de prenómina en retail implica: descargar la sábana de asistencia de GeoVictoria, cruzarla con el sistema de nómina usando tablas dinámicas en Excel, corregir inconsistencias manualmente, y recién entonces cerrar. El proceso toma entre 2.5 y 3 días con 2 analistas, dos veces al mes. Los errores generan aclaraciones, reclamos de trabajadores y reprocesos. Tras activar integración nativa con Book, el proceso baja a menos de 4 horas totales. Cita real: 'La gestión del tiempo se extiende — el día sábado en lugar de estar con tu familia, estabas haciendo la planilla.' Intensidad: 4/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-RETAIL-005",
    "category": "dolor",
    "industry": "retail",
    "subcategory": "ausentismo",
    "tags": [
      "ausentismo",
      "atrasos",
      "causal_despido",
      "alertas",
      "patrones"
    ],
    "title": "Retail — Dolor: Ausentismo y atrasos sin seguimiento",
    "content": "Sin alertas automáticas, los patrones repetitivos de ausentismo no se detectan a tiempo. Los patrones legalmente relevantes que se pierden son: faltar 3 días consecutivos (causal de despido sin indemnización en Chile), faltar 2 lunes en el mes (causal de despido en algunas legislaciones), y ausentismo crónico sin medidas correctivas. Se pierden causales de despido válidas y se pagan indemnizaciones que podían evitarse. Un cliente retail reportó detectar 3 causales de despido sin indemnización en los primeros 60 días de uso. Intensidad: 3/5.",
    "pais": "Chile",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-DOLOR-RETAIL-006",
    "category": "dolor",
    "industry": "retail",
    "subcategory": "externos",
    "tags": [
      "externos",
      "contratistas",
      "limpieza",
      "seguridad",
      "reponedores",
      "cumplimiento"
    ],
    "title": "Retail — Dolor: Control de externos inexistente",
    "content": "El retail tiene personal externo (reponedores, guardias, limpieza, promotores) de terceros que trabaja en sus instalaciones. El problema es que no saben si estos proveedores cumplen el contrato: si llegó la dotación acordada, si se cumplieron las horas firmadas. Cita real: 'Desinformación de si mis proveedores están cumpliendo contrato.' La exposición es legal (responsabilidad subsidiaria) y económica (pagar por servicios no prestados). Intensidad: 3/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-DOLOR-RETAIL-007",
    "category": "dolor",
    "industry": "retail",
    "subcategory": "sindicatos",
    "tags": [
      "sindicatos",
      "convenio",
      "ram",
      "horas",
      "bonificacion",
      "multa_dt"
    ],
    "title": "Retail — Dolor: Sindicatos y reglas de negocio complejas",
    "content": "Los convenios colectivos en retail generan reglas complejas para el cálculo de horas y bonificaciones. Los problemas son: múltiples reglas con alta dificultad de seguimiento, reglas que cambian con cada negociación colectiva, y cálculo manual propenso a errores y multas. En Chile, las multas de la DT pueden ser de hasta 60 UTM por trabajador por marcas fuera de rango. Caso real: una empresa minera fue multada 4 veces con hasta 60 UTM por persona porque sus trabajadores marcaban 5 minutos antes del inicio del turno. Intensidad: 3/5.",
    "pais": "Chile",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-DOLOR-RETAIL-008",
    "category": "dolor",
    "industry": "retail",
    "subcategory": "vacaciones",
    "tags": [
      "vacaciones",
      "permisos",
      "softland",
      "visma",
      "book",
      "workflow"
    ],
    "title": "Retail — Dolor: Vacaciones y permisos fuera del sistema",
    "content": "En la mayoría de clientes retail, vacaciones y licencias viven en sistemas separados (Softland, Visma, Book) o en Excel. Sin un workflow integrado en GeoVictoria, hay inconsistencias en la prenómina y errores de liquidación. Los trabajadores no tienen visibilidad de su saldo de vacaciones, lo que genera reclamos. Al finiquitar a alguien, puede haber discrepancias en los días de vacaciones acumulados. Intensidad: 2/5.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-META-001",
    "category": "empresa",
    "industry": "all",
    "subcategory": "descripcion",
    "tags": [
      "geovictoria",
      "empresa",
      "saas",
      "descripcion"
    ],
    "title": "¿Qué es GeoVictoria?",
    "content": "GeoVictoria es una empresa B2B SaaS de workforce management (gestión de fuerza laboral) que opera en 40+ países, principalmente en Latinoamérica y España. Ofrece soluciones de control de asistencia, control de acceso y gestión de comedor. Tiene ~12.000 clientes activos y ~$30M ARR. Su cultura interna se basa en el framework 4H: Humble, Happy, Hungry, Honest. Su posicionamiento externo hacia clientes es: Expertos, Cercanos y Simples.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-META-002",
    "category": "empresa",
    "industry": "all",
    "subcategory": "propuesta_valor",
    "tags": [
      "valor",
      "propuesta",
      "roi",
      "beneficios"
    ],
    "title": "Propuesta de valor central de GeoVictoria",
    "content": "GeoVictoria permite a las empresas: (1) Controlar asistencia en tiempo real con múltiples métodos de marcaje. (2) Planificar turnos respetando restricciones legales y contractuales. (3) Gestionar horas extra con trazabilidad y workflow de aprobación. (4) Integrarse con sistemas de nómina (Book, BUK, SAP, SIESA, ADP, Novasoft, Softland, Visma). (5) Cumplir normativa laboral y evitar multas de la DT/Inspección del Trabajo. (6) Controlar acceso a instalaciones y comedor. Los clientes reportan ROI de primer año entre 100% y 200%+, con payback de 4-6 meses.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-META-003",
    "category": "empresa",
    "industry": "all",
    "subcategory": "planes",
    "tags": [
      "starter",
      "pro",
      "enterprise",
      "precios",
      "planes"
    ],
    "title": "Planes GeoVictoria — Retail",
    "content": "GeoVictoria ofrece tres planes para retail: STARTER incluye reportería legal y de gestión, calendario inteligente básico, mapa de dotación y alertas programadas, con soporte L-V 8:30-18:30. PRO (50% sobre Starter) agrega calendario inteligente completo, alertas en base a planificado, alertas por causal de despido, reportería para clientes, módulo vacaciones y app del supervisor, con soporte extendido L-D 7:00-01:00. ENT (30% sobre PRO) agrega optimizador de dotación, workflow cambio de turno y horas por cliente, con soporte 24/7 completo.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-META-004",
    "category": "empresa",
    "industry": "all",
    "subcategory": "integraciones",
    "tags": [
      "integraciones",
      "erp",
      "nomina",
      "book",
      "buk",
      "sap",
      "victoria_connect"
    ],
    "title": "Integraciones disponibles — Victoria Connect",
    "content": "GeoVictoria se integra con los principales sistemas de nómina y RRHH a través de Victoria Connect: Book (nativa, bidireccional), BUK (nativa), SAP HCM, SAP nómina, SIESA (Colombia), Novasoft (Colombia), Softland (Chile), Visma (Perú/Chile), ADP, Ragmi, Human (México), Admóvil (México), NOI (México), Defontana, Bitácora, Rexmax. También dispone de API abierta para integraciones custom con ERPs no listados.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-OBJECION-OUT-001",
    "category": "objecion",
    "industry": "outsourcing",
    "subcategory": "sistema_funciona",
    "tags": [
      "sistema_actual",
      "stall",
      "costo_manual",
      "sandler"
    ],
    "title": "Outsourcing — Objeción: 'Lo que tenemos cumple'",
    "content": "Objeción: 'Lo que tenemos hoy cumple con lo que necesitamos.' Diagnóstico Sandler: T (Timing). No se cuantificó el costo del proceso manual ni el riesgo de incumplimiento ante el mandante. Respuesta: '¿Cuántas horas-hombre gasta tu equipo cada mes cruzando reportes para poder facturarle a tus clientes? ¿Cuántas veces al mes hay disputas con el mandante sobre horas cumplidas?' Si el cliente no tiene las cifras, ayudarlo a calcularlas en el momento — eso crea la urgencia.",
    "pais": "multipais",
    "pais_distribution": {
      "Chile": 0.346,
      "Perú": 0.263,
      "Colombia": 0.128,
      "México": 0.089,
      "Brasil": 0.078,
      "Centro América": 0.05,
      "Ecuador": 0.017,
      "República Dominicana": 0.017
    },
    "pais_n": 179,
    "pais_fuente": "excel-zoho-corregido"
  },
  {
    "id": "GV-OBJECION-OUT-002",
    "category": "objecion",
    "industry": "outsourcing",
    "subcategory": "casa_matriz",
    "tags": [
      "casa_matriz",
      "global",
      "integracion",
      "complementario",
      "bant"
    ],
    "title": "Outsourcing — Objeción: 'El sistema viene de casa matriz'",
    "content": "Objeción: 'Tenemos un sistema de casa matriz que no podemos cambiar.' Diagnóstico: puede ser condición real en multinacionales, pero frecuentemente es smokescreen cuando la decisión puede ser local. Respuesta: validar si es condición real o stall. Si es real: posicionarse como complemento vía API, no como reemplazo. 'GeoVictoria se integra con cualquier sistema vía API — no necesitas reemplazar lo que tienes, solo agregar la capa de control de asistencia.' Si es stall: excavar el dolor hasta que sea cuantificable.",
    "pais": "multipais",
    "pais_distribution": {
      "Chile": 0.306,
      "Colombia": 0.205,
      "Perú": 0.186,
      "México": 0.107,
      "Brasil": 0.075,
      "República Dominicana": 0.059,
      "Centro América": 0.046,
      "Ecuador": 0.01
    },
    "pais_n": 307,
    "pais_fuente": "excel-zoho-corregido(industria)"
  },
  {
    "id": "GV-OBJECION-OUT-003",
    "category": "objecion",
    "industry": "outsourcing",
    "subcategory": "churn_riesgo",
    "tags": [
      "churn",
      "retencion",
      "soporte",
      "pendientes",
      "riesgo"
    ],
    "title": "Outsourcing — Señal de churn: 'El soporte no responde'",
    "content": "Señal crítica de churn en outsourcing: 'El soporte no responde / Tenemos pendientes sin resolver hace meses / Solo quieren vender sin resolver lo que pidieron.' Esto NO es una objeción de venta — es una alerta de CX que debe escalar inmediatamente al CAM antes de cualquier conversación de upsell o renovación. Casos de churn alto activo: DI-012 (Colombia, 8 meses sin respuesta al módulo Contratista, riesgo alto), DI-048 (Colombia logística 3.000 col, soporte >24h, evaluación interna 'regular', dijo explícitamente 'tengo las dos opciones'), DI-037 (Perú, cliente se declaró 'detractor' activo). Regla: nunca intentar vender mientras hay dolores activos sin resolver.",
    "pais": "multipais",
    "pais_distribution": {
      "Chile": 0.306,
      "Colombia": 0.205,
      "Perú": 0.186,
      "México": 0.107,
      "Brasil": 0.075,
      "República Dominicana": 0.059,
      "Centro América": 0.046,
      "Ecuador": 0.01
    },
    "pais_n": 307,
    "pais_fuente": "excel-zoho-corregido(industria)"
  },
  {
    "id": "GV-OBJECION-RETAIL-001",
    "category": "objecion",
    "industry": "retail",
    "subcategory": "timing",
    "tags": [
      "timing",
      "stall",
      "urgencia",
      "sandler",
      "bant"
    ],
    "title": "Retail — Objeción: Timing / 'Lo vemos después'",
    "content": "Objeción: 'Estamos en proceso de evaluación / Lo vemos a inicio del año / Ahora estamos ocupados.' Clasificación Sandler: T (Timing), paso omitido 2-3. El 73% de las objeciones en retail son de este tipo — dilataciones más que condiciones reales. Lo que oculta: no se estableció dolor personal ni urgencia real. El precio nunca es la razón real; casi siempre oculta falta de valor percibido o modelo de decisión poco claro. Respuesta Sandler recomendada: cuantificar el costo de esperar. Preguntar: '¿Cuánto pagas en HH.EE. este mes sin dato exacto? ¿Cuánto le cuesta a tu equipo el cierre de nómina manual cada quincena?' Anclar en pérdida mensual, no en ganancia futura.",
    "pais": "multipais",
    "pais_distribution": {
      "Colombia": 0.373,
      "Chile": 0.232,
      "México": 0.147,
      "Perú": 0.128,
      "Brasil": 0.043,
      "Centro América": 0.031,
      "Panamá": 0.018,
      "Argentina": 0.009
    },
    "pais_n": 327,
    "pais_fuente": "excel-zoho-corregido"
  },
  {
    "id": "GV-OBJECION-RETAIL-002",
    "category": "objecion",
    "industry": "retail",
    "subcategory": "precio",
    "tags": [
      "precio",
      "presupuesto",
      "bant",
      "smokescreen",
      "roi"
    ],
    "title": "Retail — Objeción: Precio / 'Es más caro que lo que tenemos'",
    "content": "Objeción: 'Lo que pagamos con el otro sistema hace que esto se caiga / Es más caro.' Clasificación Sandler: B (Budget), paso omitido 4. Principio Sandler: las objeciones de precio casi nunca reflejan el problema real — enmascaran falta de valor percibido, incertidumbre sobre el modelo o alcance mal calibrado. Respuesta: anclar en ROI antes de hablar de precio. 'Nuestros clientes reducen su nómina variable entre 8% y 12% el primer año eliminando pagos indebidos. Eso paga el software 10 veces.' Mostrar caso KFC Colombia (USD 80K/mes ahorrado) o caso compuesto retail Chile (192% ROI año 1, payback 5 meses).",
    "pais": "multipais",
    "pais_distribution": {
      "Colombia": 0.36,
      "Perú": 0.233,
      "México": 0.128,
      "Chile": 0.105,
      "Argentina": 0.093,
      "Ecuador": 0.047,
      "Centro América": 0.035
    },
    "pais_n": 86,
    "pais_fuente": "excel-zoho-corregido"
  },
  {
    "id": "GV-OBJECION-RETAIL-003",
    "category": "objecion",
    "industry": "retail",
    "subcategory": "sistema_actual",
    "tags": [
      "sistema_actual",
      "stall",
      "manual",
      "excel",
      "riesgo"
    ],
    "title": "Retail — Objeción: 'Lo que tenemos funciona'",
    "content": "Objeción: 'Lo que tenemos hoy cumple con lo que necesitamos / Ya tenemos sistema de asistencia.' Clasificación Sandler: T (Timing), paso omitido 2-3. Lo que oculta: no se ha cuantificado el costo del proceso manual ni el riesgo de multas. Respuesta: hacer preguntas de excavación. '¿Cuántas horas inconsistentes corriges manualmente cada mes?' '¿Cuánto tarda tu cierre de nómina?' '¿Alguna vez te multó la DT?' '¿Tienes visibilidad de si tus tiendas abrieron a tiempo hoy?' Objetivo: hacer que el cliente cuantifique su propio dolor antes de hablar de la solución.",
    "pais": "multipais",
    "pais_distribution": {
      "Colombia": 0.373,
      "Chile": 0.232,
      "México": 0.147,
      "Perú": 0.128,
      "Brasil": 0.043,
      "Centro América": 0.031,
      "Panamá": 0.018,
      "Argentina": 0.009
    },
    "pais_n": 327,
    "pais_fuente": "excel-zoho-corregido"
  },
  {
    "id": "GV-OBJECION-RETAIL-004",
    "category": "objecion",
    "industry": "retail",
    "subcategory": "autoridad",
    "tags": [
      "autoridad",
      "decisor",
      "gerente",
      "bant",
      "sandler"
    ],
    "title": "Retail — Objeción: 'Hay que verlo con el gerente'",
    "content": "Objeción: 'Hay que verlo con el gerente / Con el CFO / Necesito consultarlo.' Clasificación Sandler: A (Authority), paso omitido 5. Lo que oculta: el decisor no fue identificado ni involucrado en el proceso de venta. Regla Sandler: si hay dolor confirmado y presupuesto calificado, el decisor debería estar desde el principio. Respuesta: preguntar ANTES de cerrar la reunión. '¿Quién más necesita estar en la siguiente conversación para que esto pueda avanzar?' No avanzar sin comprometer la siguiente reunión con el decisor real.",
    "pais": "multipais",
    "pais_distribution": {
      "Chile": 0.267,
      "Colombia": 0.233,
      "Perú": 0.167,
      "México": 0.133,
      "Centro América": 0.133,
      "Costa Rica": 0.033,
      "Argentina": 0.033
    },
    "pais_n": 30,
    "pais_fuente": "excel-zoho-corregido"
  },
  {
    "id": "GV-OBJECION-RETAIL-005",
    "category": "objecion",
    "industry": "retail",
    "subcategory": "integracion",
    "tags": [
      "integracion",
      "book",
      "buk",
      "sap",
      "compatibilidad",
      "need"
    ],
    "title": "Retail — Objeción: 'Tenemos Book/BUK/SAP — ¿es compatible?'",
    "content": "Objeción: 'Tenemos Book / BUK / SAP — no sé si es compatible / Necesitamos que se integre.' Clasificación Sandler: N (Need), paso omitido 3. Esta es una objeción técnica real y válida. Respuesta: presentar Victoria Connect con la lista de integraciones nativas. Para Book: integración nativa bidireccional ya disponible. Para BUK: integración nativa. Para SAP: integración disponible. Para ERPs no listados: API abierta. Cita de venta: 'GeoVictoria es el único sistema de asistencia con integración nativa certificada con Book/BUK disponible en el mercado.'",
    "pais": "multipais",
    "pais_distribution": {
      "Colombia": 0.367,
      "Chile": 0.286,
      "Perú": 0.204,
      "México": 0.061,
      "Panamá": 0.061,
      "Argentina": 0.02
    },
    "pais_n": 49,
    "pais_fuente": "excel-zoho-corregido"
  },
  {
    "id": "GV-OBJECION-RETAIL-006",
    "category": "objecion",
    "industry": "retail",
    "subcategory": "allinone",
    "tags": [
      "buk",
      "all_in_one",
      "vendor_fatigue",
      "complementario"
    ],
    "title": "Retail — Objeción: 'Estamos evaluando BUK que hace todo'",
    "content": "Objeción: 'Estamos evaluando BUK / Queremos un sistema todo-en-uno.' Clasificación Sandler: N (Need), paso omitido 3. Lo que oculta: fatiga de proveedores, integración percibida como bloqueante, no se ha diferenciado la especialización. Respuesta: posicionar GeoVictoria como complementario, no competitivo. 'BUK es el mejor sistema de nómina del mercado. GeoVictoria es el mejor sistema de asistencia. Los clientes que usan ambos tienen lo mejor de cada mundo — y los tenemos integrados nativamente.' Mostrar lista de clientes que usan BUK + GeoVictoria juntos.",
    "pais": "multipais",
    "pais_distribution": {
      "Colombia": 0.367,
      "Chile": 0.286,
      "Perú": 0.204,
      "México": 0.061,
      "Panamá": 0.061,
      "Argentina": 0.02
    },
    "pais_n": 49,
    "pais_fuente": "excel-zoho-corregido"
  },
  {
    "id": "GV-PARTICULARIDAD-CONST-001",
    "category": "particularidad",
    "industry": "construccion",
    "subcategory": "venta",
    "tags": [
      "decisor",
      "seguridad",
      "administrador_obra",
      "hardware",
      "arriendo"
    ],
    "title": "Construcción — Particularidades clave para la venta",
    "content": "Tres cosas hacen diferente la conversación en construcción: (1) El decisor NO es RRHH — es el área de Seguridad, el Administrador de Obra o el Gerente de Proyecto. Hablar solo con RRHH hace que la propuesta muera. El dolor de seguridad y evacuación es el que moviliza a quien tiene presupuesto. (2) El hardware es crítico, no opcional — a diferencia de retail, el reloj resistente y el reloj 4G son frecuentemente la condición de entrada. Llevar la propuesta sin hardware es llevarla incompleta. (3) El modelo de arriendo es el correcto — las obras tienen fecha de término. Nadie quiere comprar un reloj para una obra de 18 meses.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-PARTICULARIDAD-PLANTA-001",
    "category": "particularidad",
    "industry": "plantas_productivas",
    "subcategory": "venta",
    "tags": [
      "decisor",
      "cfo",
      "gerente_planta",
      "convenio",
      "soporte_247",
      "interlocutor"
    ],
    "title": "Plantas Productivas — Particularidades clave para la venta",
    "content": "Cuatro cosas hacen diferente la conversación en plantas industriales: (1) El interlocutor de entrada no es quien siente el dolor más fuerte — Remuneraciones siente el infierno de los cálculos manuales, pero quien firma es el Gerente de Planta o el CFO, que hablan en términos de costo de producción y riesgo operacional. Hay que cerrar la venta arriba. (2) El convenio colectivo es el documento clave — antes de presentar propuesta seria, hay que entender las reglas principales del convenio vigente. Un vendedor que no pregunta por el convenio transmite que no entiende el negocio. (3) El soporte 24/7 no es un nice-to-have — es condición de entrada. Una planta que opera toda la noche no puede tener su proveedor disponible solo L-V de 9 a 18. (4) El arriendo con SLA es el modelo correcto — en operación 24/7, el reloj es infraestructura crítica. El arriendo con SLA de reposición desbloquea la conversación.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-ROI-001",
    "category": "roi",
    "industry": "retail",
    "subcategory": "hhee",
    "tags": [
      "roi",
      "kfc",
      "horas_extra",
      "colombia",
      "caso_real"
    ],
    "title": "ROI — KFC Colombia: HH.EE. USD 100K → USD 20K/mes",
    "content": "Cliente: Cadena de restaurantes KFC, Colombia. Colaboradores: 4.912 activos. Dolor: Las horas extra no tenían control real — el dato era vulnerable y cualquiera podía manipularlo. El primer mes con GeoVictoria, la gerencia vio USD 100.000 en HH.EE. pagadas. Ese fue el turning point que le dio seriedad al proyecto. Resultado: HH.EE. bajaron de USD 100K/mes → USD 80K → USD 40K → USD 20K/mes. Ahorro mensual: USD 80.000. Ahorro anual: USD 960.000. Por qué eligió GeoVictoria: precio más económico que los 3 competidores evaluados + escalabilidad para 4.900+ personas. Fuente: DI-027.",
    "pais": "Colombia",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-ROI-002",
    "category": "roi",
    "industry": "outsourcing",
    "subcategory": "inconsistencias",
    "tags": [
      "roi",
      "inconsistencias",
      "nomina",
      "chile",
      "aseo",
      "caso_real"
    ],
    "title": "ROI — Outsourcing Chile: 3.500 inconsistencias/mes → 15",
    "content": "Cliente: Empresa de servicios de aseo (clientes: SMU, INACAP), Chile. Colaboradores: 1.500. Dolor: Al revisar asistencia 2 veces al mes encontraban 3.500 inconsistencias. Era imposible cerrar la nómina en plazo. Los pagos se retrasaban o salían con error. Resultado: las inconsistencias bajaron de 3.500/mes a 15 — una reducción del 99,6%. Cita textual: 'Atacar 3.500 inconsistencias era imposible llegar en los plazos para los pagos... cambiamos a 15 con suerte.' Por qué eligió GeoVictoria: la usuaria lleva 13 años con GeoVictoria en dos empresas distintas. Fuente: DI-028.",
    "pais": "Chile",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-ROI-003",
    "category": "roi",
    "industry": "plantas_productivas",
    "subcategory": "nomina",
    "tags": [
      "roi",
      "nomina",
      "mexico",
      "planta",
      "jornada_12h",
      "caso_real"
    ],
    "title": "ROI — Planta México: cierre de nómina de 3 días → 10 horas",
    "content": "Cliente: Planta industrial (Grupo ECOM/ICO), México. Colaboradores: <500. Jornadas de 12 horas con HH.EE. dobles y triples. Dolor: Requería descargar 3+ reportes y cruzarlos con fórmulas Excel propias para calcular las incidencias. El proceso de nómina tomaba 3 días de trabajo completo. Resultado: el proceso pasó de 3 días a ~10 horas-hombre. Cita textual: 'De una inversión de 3 días a una inversión de quizás ahora de 10 horas hombre.' Este cliente recomendó GeoVictoria al corporativo ECOM/ICO. Fuente: DI-006.",
    "pais": "México",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-ROI-004",
    "category": "roi",
    "industry": "retail",
    "subcategory": "ausentismo",
    "tags": [
      "roi",
      "optica",
      "peru",
      "ausentismo",
      "caso_real"
    ],
    "title": "ROI — Óptica Perú: ausentismo de 1,5% → 1,37% regional",
    "content": "Cliente: Cadena de ópticas, Perú. 263 tiendas activas, ~1.000 usuarios. Dolor: Sin carga masiva de jefaturas, asignaciones manuales una a una para 263 tiendas. 10-15 solicitudes de gestión diarias. Ausentismo regional sin control. Resultado: ausentismo regional bajó de 1,5% a 1,37% (meta: 0,25%). GeoVictoria opera regionalmente en Chile, Colombia y Ecuador para este cliente. Cita textual: 'La opción de la IA en el WhatsApp, ese sí va a ser un golazo. La veo por todos lados que va a funcionar.' Fuente: DI-018.",
    "pais": "Perú",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-ROI-005",
    "category": "roi",
    "industry": "retail",
    "subcategory": "consolidacion",
    "tags": [
      "roi",
      "supermercado",
      "chile",
      "libro",
      "tiempo_real",
      "caso_real"
    ],
    "title": "ROI — Supermercado Chile: de 1 mes → tiempo real para 150 salas",
    "content": "Cliente: Supermercado Chile (ex SMU, Klin, Castaño). 150 salas activas, 2.407 empleados. Dolor: Con libros físicos, consolidar información de 150 salas tardaba un mes. Nadie tenía datos en tiempo real para gerencia. Competidores evaluados (WebControl, Book módulo asistencia) no tenían certificación DT vigente. Resultado: información en tiempo real desde cualquier sala para cualquier consulta gerencial. Cita textual: 'Antes con libros tardabas un mes en consolidar. Ahora puedo dar información en tiempo real para cualquier consulta gerencial.' GeoVictoria fue la única empresa recertificada ante la DT al momento de la licitación. Fuente: DI-008.",
    "pais": "Chile",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-ROI-006",
    "category": "roi",
    "industry": "retail",
    "subcategory": "compuesto",
    "tags": [
      "roi",
      "compuesto",
      "chile",
      "moda",
      "192%",
      "payback"
    ],
    "title": "ROI — Caso compuesto retail Chile: 192% ROI año 1",
    "content": "Caso compuesto basado en datos reales de clientes GeoVictoria Chile. Cadena de moda, 110 tiendas, 2.400 colaboradores. Dolores cuantificados: (1) HH.EE. sin respaldo 18% → <2%: ahorro CLP 92.160.000/año. (2) Cierre nómina 3 días → 4 horas: ahorro CLP 6.336.000/año. (3) Aperturas tardías de 7 a 1/mes: ahorro CLP 21.600.000/año. (4) Causales de despido recuperadas: ahorro CLP 6.000.000/año. Total ahorro: CLP 126.096.000/año. Costo GeoVictoria plan PRO (~2.400 col): CLP ~43.200.000/año. ROI neto año 1: CLP 82.896.000. ROI porcentual: 192%. Payback: ~5 meses.",
    "pais": "Chile",
    "pais_fuente": "texto-chunk"
  },
  {
    "id": "GV-SANDLER-001",
    "category": "metodologia",
    "industry": "all",
    "subcategory": "sandler",
    "tags": [
      "sandler",
      "objecion",
      "dolor",
      "bant",
      "submarino",
      "metodologia"
    ],
    "title": "Framework Sandler aplicado a GeoVictoria",
    "content": "En Sandler, una objeción NO es un obstáculo — es un síntoma de que un paso previo fue omitido o mal ejecutado. Si el dolor, el presupuesto y la autoridad se calificaron bien, las objeciones no deberían aparecer. Los 3 niveles de dolor en GeoVictoria: (1) SUPERFICIE (síntoma visible): 'Nuestro sistema de asistencia falla / los empleados no marcan bien.' (2) NEGOCIO (impacto medible): 'Pagamos sobretiempos incorrectos. Perdemos horas en cuadrar planillas. Riesgo de multa en fiscalización.' (3) PERSONAL/EMOCIONAL (dolor del decisor): 'Me van a cuestionar en la auditoría. Si esto falla otra vez, me va a costar el trabajo.' La venta debe llegar al nivel 3 para generar urgencia real de compra.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SANDLER-002",
    "category": "metodologia",
    "industry": "all",
    "subcategory": "bant",
    "tags": [
      "bant",
      "timing",
      "budget",
      "authority",
      "need",
      "clasificacion"
    ],
    "title": "Clasificación BANT de objeciones en GeoVictoria",
    "content": "Clasificación BANT de las objeciones más comunes en GeoVictoria: T (Timing) = 'Falta de urgencia' — paso omitido 2-3, no se estableció contrato previo ni dolor personal. Es el tipo más frecuente (73% del dataset de 8.900+ reuniones). N (Need) = 'Facilidad de uso, integración, seguridad' — paso 3, dolor técnico no explorado. B (Budget) = 'Precio, presupuesto' — paso 4, presupuesto no calificado antes de presentar. A (Authority) = 'Aprobaciones internas' — paso 5, decisores no identificados ni involucrados. Distinción clave: Objeción (resistencia con argumento) vs. Stall (táctica dilatoria, 'necesito pensarlo') vs. Condición (barrera real inamovible). El 73% son Stalls, no Condiciones.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-CONST-001",
    "category": "solucion",
    "industry": "construccion",
    "subcategory": "contratistas",
    "tags": [
      "gestion_contratistas",
      "documentacion",
      "acceso",
      "subcontratistas"
    ],
    "title": "Construcción — Solución: Gestión de contratistas y gestión documental",
    "content": "La combinación de Gestión de Contratistas + Gestión Documental de GeoVictoria permite: ver la dotación de personal por empresa contratista, cargo y horas cumplidas, bloquear el ingreso a la obra de personas sin documentación vigente (inducción, examen ocupacional, previsión al día), tener en todo momento la lista de quién está dentro de la obra para una evacuación de emergencia, y procesar la asistencia de los externos de forma automática sin trabajo manual diario.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-CONST-002",
    "category": "solucion",
    "industry": "construccion",
    "subcategory": "marcaje",
    "tags": [
      "reloj_resistente",
      "app_cuadrilla",
      "4g",
      "offline",
      "reconocimiento_facial"
    ],
    "title": "Construcción — Métodos de marcaje para obras",
    "content": "Métodos específicos para construcción: RELOJ RESISTENTE ESPECIAL PARA OBRAS (diseñado para condiciones de obra, se puede arrendar por el período de la obra), APP CUADRILLA (el supervisor marca por su cuadrilla con trazabilidad individual, para cuando los trabajadores no tienen celular), RELOJ CON DATOS MÓVILES 4G (no depende de la red del cliente, se puede mover si la obra se desplaza, ideal para obras remotas), RECONOCIMIENTO FACIAL RESISTENTE (elimina el fraude de foto compartida). Modelo de negocio recomendado: ARRIENDO por obra, no compra — las obras tienen fecha de término.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-OUT-001",
    "category": "solucion",
    "industry": "outsourcing",
    "subcategory": "ram_mandante",
    "tags": [
      "ram",
      "mandante",
      "cumplimiento",
      "reporte",
      "facturacion"
    ],
    "title": "Outsourcing — Solución: RAM para mandante",
    "content": "El Reporte a Medida (RAM) para outsourcing permite generar reportes de Horas Trabajadas (HT), Horas No Trabajadas (HNT) y HH.EE. desglosados por cliente, servicio y grupo. El mandante (cliente final) puede tener acceso al reporte para verificar en tiempo real el cumplimiento del servicio contratado. Esto habilita el cobro de la factura con evidencia irrefutable y previene disputas. Es el módulo diferenciador más mencionado en entrevistas de clientes outsourcing.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-OUT-002",
    "category": "solucion",
    "industry": "outsourcing",
    "subcategory": "calendario",
    "tags": [
      "calendario_inteligente",
      "outsourcing",
      "slots",
      "mandante",
      "asignacion"
    ],
    "title": "Outsourcing — Solución: Calendario Inteligente para Outsourcing",
    "content": "El Calendario Inteligente de GeoVictoria para outsourcing asigna personas a los slots de tiempo que el outsourcing debe cumplir con el mandante (cliente final). La asignación respeta simultáneamente: restricciones legales locales, jornada del trabajador individual, condiciones del contrato con el cliente, y restricciones de la industria. El sistema alerta cuando se planifican horas de más, o no se cumplen restricciones de sábados/domingos libres en el mes y el año.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-OUT-003",
    "category": "solucion",
    "industry": "outsourcing",
    "subcategory": "marcaje",
    "tags": [
      "call",
      "app",
      "cuadrilla",
      "box_5g",
      "marcaje",
      "sin_infraestructura"
    ],
    "title": "Outsourcing — Métodos de marcaje sin infraestructura del mandante",
    "content": "El outsourcing no puede instalar hardware en las instalaciones del cliente. Métodos disponibles: CALL (marcaje telefónico para puntos con menos de 5 personas, sin infraestructura), APP (puntos donde no se puede modificar la infraestructura del mandante), APP CUADRILLA (cuando hay supervisor y trabajadores no usan celular propio), BOX 5G EN ARRIENDO (marcaje asegurado sin depender de la red del cliente ni del teléfono del trabajador, ideal para puntos medianos), RELOJ FACIAL EN CASA MATRIZ (el mejor reloj en la oficina central — también es marketing).",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-OUT-004",
    "category": "solucion",
    "industry": "outsourcing",
    "subcategory": "contratistas",
    "tags": [
      "modulo_contratista",
      "distribucion_costos",
      "grupos",
      "liquidacion"
    ],
    "title": "Outsourcing — Solución: Módulo Contratistas",
    "content": "El Módulo Contratistas de GeoVictoria permite: visualizar la dotación de personal por empresa contratista y cargo, controlar horas cumplidas vs. contratadas por servicio, generar reportes de distribución de costos por servicio integrados con la liquidación de nómina, y verificar parámetros contractuales (horas contratadas vs. programadas por cliente). Es el módulo de upsell más natural para outsourcing avanzado y el más mencionado como dolor no resuelto en entrevistas.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-PLANTA-001",
    "category": "solucion",
    "industry": "plantas_productivas",
    "subcategory": "calendario",
    "tags": [
      "calendario_24/7",
      "amanecida",
      "turnos_rotativos",
      "horas_contractuales"
    ],
    "title": "Plantas Productivas — Solución: Calendario Inteligente 24/7",
    "content": "El Calendario Inteligente de GeoVictoria para plantas industriales lee correctamente los turnos de amanecida que cruzan días, detecta personas con menos horas planificadas que las contractuales, alerta cuando se violan restricciones legales o de convenio, y permite planificar turnos 24/7 complejos con múltiples rotaciones. Especialmente diseñado para operaciones de 3 o 4 turnos rotativos. Disponible en plan PRO y ENT.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-PLANTA-002",
    "category": "solucion",
    "industry": "plantas_productivas",
    "subcategory": "ram_convenio",
    "tags": [
      "ram",
      "convenio",
      "hhee_dobles",
      "hhee_triples",
      "reglas_negocio",
      "nómina"
    ],
    "title": "Plantas Productivas — Solución: RAM + reglas de negocio del convenio",
    "content": "La combinación de RAM (Reporte a Medida) + Reglas de negocio configurables permite calcular automáticamente: HH.EE. dobles y triples según los criterios de corte propios de la empresa (no estándar), prima dominical y feriados para turnos nocturnos que cruzan días, bonificaciones por zona productiva según el convenio vigente, y descansos elaborados. Cuando el convenio cambia, las reglas se reconfiguran. Resultado: de 3 días de trabajo manual a 10 horas-hombre para cerrar nómina.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-PLANTA-003",
    "category": "solucion",
    "industry": "plantas_productivas",
    "subcategory": "comedor",
    "tags": [
      "modulo_comedor",
      "colaciones",
      "proveedor",
      "presencia",
      "uniformes"
    ],
    "title": "Plantas Productivas — Solución: Módulo Comedor y Control de Uniformes",
    "content": "El Módulo Comedor de GeoVictoria permite: asignar colaciones a personas según restricciones del negocio (si no tiene marca de asistencia del día, no puede acceder al comedor), controlar el cobro del proveedor de alimentación (Sodexo, Aramark, Hendaya), y registrar restricciones especiales (dieta, alergias, raciones especiales). El Control de Uniformes usa la misma lógica: registrar entrega, talla, estado y vencimiento de EPP y uniformes por trabajador.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-PLANTA-004",
    "category": "solucion",
    "industry": "plantas_productivas",
    "subcategory": "hardware",
    "tags": [
      "reloj_resistente",
      "arriendo",
      "mantenimiento",
      "sla",
      "24/7"
    ],
    "title": "Plantas Productivas — Solución: Hardware resistente con arriendo y SLA",
    "content": "Para plantas que operan 24/7: RELOJ CONTROL FACIAL RESISTENTE PARA PLANTAS PRODUCTIVAS (diseñado para condiciones industriales, polvo, humedad, temperatura), disponible en modalidad de ARRIENDO con mantenimiento preventivo y SLA de reposición ante falla. La app sirve como respaldo cuando el reloj falla en turno nocturno. El soporte 24/7 (L-D 00:00-23:59) está incluido en el plan ENT y no es negociable para una planta que opera continuamente.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-RETAIL-001",
    "category": "solucion",
    "industry": "retail",
    "subcategory": "calendario",
    "tags": [
      "calendario_inteligente",
      "turnos",
      "planificacion",
      "legal"
    ],
    "title": "Retail — Solución: Calendario Inteligente",
    "content": "El Calendario Inteligente de GeoVictoria asigna turnos respetando automáticamente: restricciones legales (domingos libres, máximo de horas semanales, no más de 7 días continuos), condiciones del contrato individual, horas contractuales mínimas por trabajador, y restricciones de la industria. El sistema alerta cuando se planifica incorrectamente ANTES de publicar la malla. Permite visualizar la dotación vs. la demanda esperada. Disponible en plan PRO y ENT para retail.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-RETAIL-002",
    "category": "solucion",
    "industry": "retail",
    "subcategory": "alertas",
    "tags": [
      "alertas",
      "apertura",
      "cargo_critico",
      "atrasos",
      "ausentismo",
      "causal_despido"
    ],
    "title": "Retail — Solución: Alertas automáticas",
    "content": "GeoVictoria ofrece múltiples tipos de alertas para retail: (1) Alerta de apertura/cierre de tienda — notifica si una sucursal sigue cerrada a los X minutos de la hora de apertura. (2) Alerta de cargo crítico — notifica si el tesorero, guardia o jefe de tienda no ha llegado. (3) Alertas de atrasos y ausentismos — detecta patrones repetitivos. (4) Alerta de causal de despido — notifica cuando un trabajador cumple las condiciones legales para despido sin indemnización (3 días consecutivos, 2 lunes en el mes). (5) Alerta de domingos legales (Chile) — seguimiento automático de domingos trabajados/libres por trabajador.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-RETAIL-003",
    "category": "solucion",
    "industry": "retail",
    "subcategory": "integracion",
    "tags": [
      "victoria_connect",
      "book",
      "sap",
      "nomina",
      "integracion",
      "prenomina"
    ],
    "title": "Retail — Solución: Integración con sistemas de nómina",
    "content": "La integración nativa de GeoVictoria con Book (y otros ERPs vía Victoria Connect) automatiza el paso de asistencia a prenómina. El proceso que antes tomaba 3 días con 2 analistas baja a menos de 4 horas. La integración es bidireccional: vacaciones, licencias y permisos aprobados en Book/BUK viajan automáticamente a GeoVictoria, y las novedades de asistencia viajan al sistema de nómina. Caso real: 'Desde junio que estoy viéndolo y la verdad que nos quitaría bastante trabajo que conversen ambos sistemas.' (DI-016, Chile, 206 col, 15 tiendas)",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-RETAIL-004",
    "category": "solucion",
    "industry": "retail",
    "subcategory": "control_externos",
    "tags": [
      "externos",
      "contratistas",
      "limpieza",
      "seguridad",
      "cumplimiento_contrato"
    ],
    "title": "Retail — Solución: Control de externos / contratistas",
    "content": "El módulo de control de externos permite al retail verificar el cumplimiento de contratos con proveedores de servicios (limpieza, seguridad, reponedores, promotores). Funcionalidades: verificar si llegó la dotación acordada por contrato, controlar si se cumplieron las horas firmadas, acceso al reporte en tiempo real para el mandante, y generar evidencia de incumplimiento para penalizar al proveedor.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-RETAIL-005",
    "category": "solucion",
    "industry": "retail",
    "subcategory": "horas_extra",
    "tags": [
      "horas_extra",
      "workflow",
      "banco_horas",
      "aprobacion",
      "trazabilidad"
    ],
    "title": "Retail — Solución: Control de horas extra",
    "content": "GeoVictoria ofrece un workflow de aprobación de HH.EE. con registro completo dentro del sistema (no por correo ni WhatsApp). El Banco de Horas permite gestionar compensaciones y registrar horas debidas con trazabilidad. Las HH.EE. se aprueban con un clic y quedan registradas con quién aprobó, cuándo y cuántas horas. Esto elimina la figura del supervisor como 'juez y parte'. Resultado: KFC Colombia redujo HH.EE. de USD 100K a USD 20K/mes.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-SOLUCION-RETAIL-006",
    "category": "solucion",
    "industry": "retail",
    "subcategory": "marcaje",
    "tags": [
      "box_wifi",
      "app",
      "cuadrilla",
      "tablet_qr",
      "reloj",
      "marcaje"
    ],
    "title": "Retail — Métodos de marcaje disponibles",
    "content": "Métodos de marcaje para retail: BOX WIFI (marca simple y fidedigna en sucursales, método principal), APP (personal con movimiento entre tiendas, mayor flexibilidad), APP CUADRILLA (alternativa económica con supervisor, para personal no recurrente), TABLET QR DINÁMICO (para países donde el reloj es costoso, QR rotativo anti-fraude), RELOJ DE ALTO TRÁFICO (para bodegas con colas largas), RELOJ DE DISEÑO ESPECIAL PARA CASA MATRIZ (el más estético, también es marketing interno). Soporte diferenciado: Starter L-V, PRO L-D 7-1, ENT 24/7.",
    "pais": "all",
    "pais_fuente": "transversal"
  },
  {
    "id": "GV-TRIGGER-ALL-001",
    "category": "trigger",
    "industry": "all",
    "subcategory": "apertura",
    "tags": [
      "preguntas",
      "apertura",
      "sandler",
      "dolor",
      "conversacion"
    ],
    "title": "Preguntas de apertura universales — Sandler",
    "content": "Preguntas de excavación universales válidas para todas las industrias: '¿Cuántos días le toma a tu equipo cerrar la prenómina cada quincena?' / '¿Cuántas inconsistencias de marcaje corriges manualmente por mes?' / '¿Tienes visibilidad en tiempo real de si tu gente llegó hoy?' / '¿Alguna vez te multó la DT o la Inspección del Trabajo por temas de asistencia?' / '¿Puedes demostrar en este momento quién está en tus instalaciones y con qué documentación?' / '¿Tu sistema actual te alerta cuando un trabajador cumple las condiciones para ser despedido sin indemnización?' / '¿Sabes cuánto estás pagando de horas extra y si todas tienen respaldo?' Objetivo: hacer que el cliente cuantifique su propio dolor antes de hablar de precio o solución.",
    "pais": "all",
    "pais_fuente": "transversal"
  }
];


// Filtra chunks por industria + categorías, con filtro de país opcional.
// País: incluye el chunk si es del país pedido, o transversal ("all"/"multipais").
export function selectChunks(kbIndustry, categories, opts = {}) {
  const { includeAll = true, limitPerCategory = 6, subcategory = null, pais = null } = opts;
  const out = [];
  for (const cat of categories) {
    let pool = KB.filter(
      (c) =>
        c.category === cat &&
        (c.industry === kbIndustry || (includeAll && c.industry === "all"))
    );
    if (pais) {
      pool = pool.filter(
        (c) => c.pais === pais || c.pais === "all" || c.pais === "multipais"
      );
    }
    if (subcategory) {
      const m = pool.filter((c) => c.subcategory === subcategory);
      if (m.length) pool = m;
    }
    out.push(...pool.slice(0, limitPerCategory));
  }
  return out;
}

// Texto para inyectar en un prompt. Si el chunk tiene pais_distribution, la resume.
export function formatChunks(chunks) {
  return chunks
    .map((c) => {
      let line = `• ${c.title}\n  ${c.content}`;
      if (c.pais_distribution) {
        const top = Object.entries(c.pais_distribution)
          .slice(0, 4)
          .map(([p, v]) => `${p} ${Math.round(v * 100)}%`)
          .join(", ");
        line += `\n  [Frecuencia por país: ${top}]`;
      }
      return line;
    })
    .join("\n\n");
}

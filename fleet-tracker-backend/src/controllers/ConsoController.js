import ConsoService from "../service/ConsoService.js";

class ConsoController {

  // CHAUFFEUR
  async create(req, res) {
    try {
        console.log("req.body",req.body);
        console.log("req.user._id",req.user._id);
      const consommation = await ConsoService.create(
        req.body,
        req.user._id
      );

     res.status(201).json({
    succes: true,
    message: "Consommation created",
    data: consommation
});

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  // CHAUFFEUR & ADMIN
  async getByTrajet(req, res) {
    try {

       
      const consommations = await ConsoService.getByTrajet(
        req.params.id
      );

      res.json(
        {
            succes:true,
            message:"voici listes de consommation",
            data:consommations
        }
      );
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // ADMIN
  async getAll(req, res) {
    try {
      const consommations = await ConsoService.getAll();
      res.json(consommations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }









  // ADMIN
  async delete(req, res) {
    try {
      await Conso.delete(req.params.id);
      res.json({ message: "Consommation supprimée" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new ConsoController();
